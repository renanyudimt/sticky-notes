import { render, screen, within } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRenderCounter, RenderProbe } from "@/test/renderCount";

import type { Note as NoteModel } from "../../types";
import { NoteCard } from "./NoteCard";

vi.mock("../NoteEditorConnector", () => ({
  NoteEditorConnector: ({ id }: { id: string }) => (
    <div data-testid={`editor-${id}`} />
  ),
}));

const createMockNote = (overrides: Partial<NoteModel> = {}): NoteModel => ({
  id: "note-1",
  position: { x: 40, y: 60 },
  size: { width: 200, height: 180 },
  text: "Reminder",
  color: "yellow",
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

const createMockHandlers = () => ({
  getBoardRect: () =>
    ({ width: 1000, height: 800, left: 0, top: 0 }) as DOMRect,
  onFocus: vi.fn(),
  onMoveStart: vi.fn(),
  onMove: vi.fn(),
  onMoveEnd: vi.fn(),
  onResize: vi.fn(),
  onResizeEnd: vi.fn(),
  onColorChange: vi.fn(),
  onEditText: vi.fn(),
  onDelete: vi.fn(),
});

const renderNote = (overrides: Partial<NoteModel> = {}) => {
  const handlers = createMockHandlers();
  const note = createMockNote(overrides);
  render(<NoteCard note={note} zIndex={3} {...handlers} />);
  return { note, ...handlers };
};

describe("NoteCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should position and size the note from its model", () => {
    const { note } = renderNote();
    const element = screen.getByTestId(`note-${note.id}`);

    expect(element).toHaveStyle({
      left: "40px",
      top: "60px",
      width: "200px",
      height: "180px",
      zIndex: "3",
    });
  });

  it("should wire the editor connector to its own note id", () => {
    const { note } = renderNote();
    expect(screen.getByTestId(`editor-${note.id}`)).toBeInTheDocument();
  });

  it("should render all eight resize handles", () => {
    const { note } = renderNote();
    const element = screen.getByTestId(`note-${note.id}`);
    const handles = within(element)
      .getAllByRole("button")
      .filter((node) => node.dataset.testid?.startsWith("resize-"));
    expect(handles).toHaveLength(8);
  });

  it("should bring the note to front on pointer down", async () => {
    const { onFocus, note } = renderNote();
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId(`note-${note.id}`),
      keys: "[MouseLeft>]",
    });

    expect(onFocus).toHaveBeenCalledWith(note.id);
  });

  it("should start a move when pressing the drag handle", async () => {
    const { onMoveStart, note } = renderNote();
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId("note-drag-handle"),
      keys: "[MouseLeft>]",
    });

    expect(onMoveStart).toHaveBeenCalledWith(note.id);
  });

  // Regression: pressing the drag handle must NOT bubble to the surface's
  // `onFocus`. Focusing reorders the notes array (stacking) and moves this DOM
  // node mid-press, which cancels the just-started pointer drag — the reason a
  // note used to need a click before it could be dragged.
  it("should not focus the note when pressing the drag handle", async () => {
    const { onFocus } = renderNote();
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId("note-drag-handle"),
      keys: "[MouseLeft>]",
    });

    expect(onFocus).not.toHaveBeenCalled();
  });

  it("should emit delete when the deletion is confirmed", async () => {
    const { onDelete, note } = renderNote();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Delete note" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });

  // The delete dialog renders in a portal, so its pointer events bubble through
  // the React tree back into the card's drag handle. Guard against that leaking
  // a phantom move/focus when the user just interacts with the dialog.
  it("should not start a move or focus the note when dismissing the dialog", async () => {
    const { onMoveStart, onFocus } = renderNote();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Delete note" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onMoveStart).not.toHaveBeenCalled();
    expect(onFocus).not.toHaveBeenCalled();
  });

  it("should emit a color change from the picker", async () => {
    const { onColorChange, note } = renderNote();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Change note color" }));
    await user.click(screen.getByRole("option", { name: "Pink" }));

    expect(onColorChange).toHaveBeenCalledWith(note.id, "pink");
  });
});

describe("NoteCard render count", () => {
  const renderProbed = (overrides: Partial<NoteModel> = {}) => {
    const handlers = { zIndex: 0, ...createMockHandlers() };
    const counter = createRenderCounter();
    const note = createMockNote(overrides);
    render(
      <RenderProbe id="note-card" onRender={counter.onRender}>
        <NoteCard note={note} {...handlers} />
      </RenderProbe>,
    );
    return { counter, note };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const MAX_MOUNT_COMMITS = 2;

  it("should mount without a render loop", () => {
    const { counter } = renderProbed();
    expect(counter.count("note-card")).toBeLessThanOrEqual(MAX_MOUNT_COMMITS);
  });

  const stableHandlers = () => ({ zIndex: 0, ...createMockHandlers() });

  const trackRenders = (renderSpy: () => void): NoteModel =>
    new Proxy(createMockNote(), {
      get(target, prop, receiver) {
        if (prop === "id") renderSpy();
        return Reflect.get(target, prop, receiver);
      },
    });

  it("should not re-render when its props are unchanged", () => {
    const renderSpy = vi.fn();
    const note = trackRenders(renderSpy);
    const handlers = stableHandlers();

    const { rerender } = render(<NoteCard note={note} {...handlers} />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    renderSpy.mockClear();
    rerender(<NoteCard note={note} {...handlers} />);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it("should re-render when its own note changes", () => {
    const renderSpy = vi.fn();
    const handlers = stableHandlers();
    const note = trackRenders(renderSpy);

    const { rerender } = render(<NoteCard note={note} {...handlers} />);
    renderSpy.mockClear();

    const moved = trackRenders(renderSpy);
    rerender(<NoteCard note={moved} {...handlers} />);

    expect(renderSpy).toHaveBeenCalled();
  });
});
