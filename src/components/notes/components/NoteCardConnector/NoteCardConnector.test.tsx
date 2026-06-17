import { act, render, screen } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { useEffect, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRenderCounter, RenderProbe } from "@/test/renderCount";

import { resetNotesStores, useNoteActions, useNoteIds } from "../../store";
import { NoteCardConnector } from "./NoteCardConnector";

const handlers = {
  zIndex: 0,
  getBoardRect: () => null,
  onFocus: vi.fn(),
  onMoveStart: vi.fn(),
  onMove: vi.fn(),
  onMoveEnd: vi.fn(),
  onResize: vi.fn(),
  onResizeEnd: vi.fn(),
  onColorChange: vi.fn(),
  onDelete: vi.fn(),
};

function Seed({ children }: { children: (id?: string) => ReactNode }) {
  const actions = useNoteActions();
  const ids = useNoteIds();
  return (
    <>
      <button
        type="button"
        onClick={() => actions.addNote({ position: { x: 12, y: 34 } })}
      >
        add
      </button>
      {children(ids[0])}
    </>
  );
}

describe("NoteCardConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStores();
  });

  it("should render nothing for an unknown id", () => {
    render(<NoteCardConnector id="missing" {...handlers} />);
    expect(screen.queryByRole("article", { name: "Note" })).toBeNull();
  });

  it("should render the note it sources from the store", async () => {
    const user = userEvent.setup();
    render(
      <Seed>
        {(id) => (id ? <NoteCardConnector id={id} {...handlers} /> : null)}
      </Seed>,
    );

    expect(screen.queryByRole("article", { name: "Note" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "add" }));

    const note = await screen.findByRole("article", { name: "Note" });
    expect(note).toHaveStyle({ left: "12px", top: "34px" });
  });

  // The core win of the granular subscriptions: moving one note re-renders only
  // its own connector. The probes share a parent that subscribes to the (stable)
  // id list, so a sibling's probe fires only if the sibling itself commits.
  it("should re-render only the moved note's connector", () => {
    const counter = createRenderCounter();
    const actionsRef: { current: ReturnType<typeof useNoteActions> | null } = {
      current: null,
    };

    function Capture() {
      const actions = useNoteActions();
      useEffect(() => {
        actionsRef.current = actions;
      }, [actions]);
      return null;
    }

    function Cards() {
      const ids = useNoteIds();
      return (
        <>
          {ids.map((id) => (
            <RenderProbe key={id} id={id} onRender={counter.onRender}>
              <NoteCardConnector id={id} {...handlers} />
            </RenderProbe>
          ))}
        </>
      );
    }

    render(
      <>
        <Capture />
        <Cards />
      </>,
    );

    let a = "";
    let b = "";
    act(() => {
      a = actionsRef.current!.addNote({ position: { x: 0, y: 0 } }).id;
      b = actionsRef.current!.addNote({ position: { x: 0, y: 0 } }).id;
    });

    counter.reset();
    act(() => {
      actionsRef.current!.moveNote(a, { x: 200, y: 200 });
    });

    expect(counter.count(a)).toBeGreaterThan(0);
    expect(counter.count(b)).toBe(0);
  });
});
