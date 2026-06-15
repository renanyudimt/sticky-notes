import { act, renderHook } from "@testing-library/react";
import { createRef, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotesProvider, useNotesList, useNotesStore } from "@/components/notes";
import type { NotesRepository } from "@/components/persistence";

import { useBoardController } from "./useBoardController";

const repository: NotesRepository = {
  load: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
};

const fakeEl = (rect: Partial<DOMRect>) =>
  ({ getBoundingClientRect: () => rect as DOMRect }) as HTMLDivElement;

const wrapper = ({ children }: { children: ReactNode }) => (
  <NotesProvider repository={repository} autoHydrate={false} persistDelay={0}>
    {children}
  </NotesProvider>
);

const dispatch = (type: string, clientX: number, clientY: number) => {
  window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
};

const setup = () => {
  const boardRef = createRef<HTMLDivElement>();
  const trashRef = createRef<HTMLDivElement>();
  boardRef.current = fakeEl({ left: 0, top: 0, width: 1000, height: 800 });
  trashRef.current = fakeEl({ left: 400, top: 700, width: 200, height: 80 });

  // The controller now exposes only note ids and no longer holds drag state;
  // pull the full list and the over-trash flag from the store alongside it so
  // the assertions can still inspect positions and drag state.
  const view = renderHook(
    () => ({
      ...useBoardController(boardRef, trashRef),
      notes: useNotesList(),
      isOverTrash: useNotesStore((s) => s.isOverTrash),
    }),
    { wrapper },
  );
  return view;
};

const createNoteAt = (
  result: ReturnType<typeof setup>["result"],
  x: number,
  y: number,
) => {
  const el = {};
  const event = {
    target: el,
    currentTarget: el,
    clientX: x,
    clientY: y,
  } as unknown as React.MouseEvent;

  act(() => result.current.onBoardDoubleClick(event));
};

const clickBoardAt = (
  result: ReturnType<typeof setup>["result"],
  x: number,
  y: number,
) => {
  const el = {};
  const event = {
    target: el,
    currentTarget: el,
    button: 0,
    clientX: x,
    clientY: y,
    nativeEvent: {},
  } as unknown as React.PointerEvent;

  act(() => result.current.onBoardPointerDown(event));
  act(() => dispatch("pointerup", x, y));
};

describe("useBoardController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start with no notes", () => {
    const { result } = setup();
    expect(result.current.notes).toHaveLength(0);
  });

  it("should create a default note centered on a double-click", () => {
    const { result } = setup();

    createNoteAt(result, 120, 140);

    expect(result.current.notes).toHaveLength(1);
    // 220x220 default note centered on the cursor: 120-110, 140-110
    expect(result.current.notes[0].position).toEqual({ x: 10, y: 30 });
  });

  it("should not create a note on a plain click", () => {
    const { result } = setup();

    clickBoardAt(result, 200, 200);

    expect(result.current.notes).toHaveLength(0);
  });

  it("should move a note via the move handler", () => {
    const { result } = setup();
    createNoteAt(result, 100, 100);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMove(
        id,
        { x: 250, y: 260 },
        { x: 250, y: 260, width: 220, height: 220 },
      ),
    );

    expect(result.current.notes[0].position).toEqual({ x: 250, y: 260 });
  });

  it("should flag isOverTrash while moving onto the trash zone", () => {
    const { result } = setup();
    createNoteAt(result, 100, 100);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMove(
        id,
        { x: 420, y: 710 },
        { x: 420, y: 710, width: 100, height: 100 },
      ),
    );

    expect(result.current.isOverTrash).toBe(true);
  });

  it("should delete the note when released over the trash zone", () => {
    const { result } = setup();
    createNoteAt(result, 100, 100);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMoveEnd(
        id,
        { x: 420, y: 710 },
        { x: 420, y: 710, width: 100, height: 100 },
      ),
    );

    expect(result.current.notes).toHaveLength(0);
  });

  it("should keep the note when released away from the trash zone", () => {
    const { result } = setup();
    createNoteAt(result, 100, 100);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMoveEnd(
        id,
        { x: 50, y: 50 },
        { x: 50, y: 50, width: 100, height: 100 },
      ),
    );

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.isOverTrash).toBe(false);
  });

  it("should clear all notes", () => {
    const { result } = setup();
    createNoteAt(result, 100, 100);
    createNoteAt(result, 200, 200);

    act(() => result.current.onClear());

    expect(result.current.notes).toHaveLength(0);
  });

  it("should not re-render the board when drag/over-trash state changes", () => {
    const boardRef = createRef<HTMLDivElement>();
    const trashRef = createRef<HTMLDivElement>();
    boardRef.current = fakeEl({ left: 0, top: 0, width: 1000, height: 800 });
    trashRef.current = fakeEl({ left: 400, top: 700, width: 200, height: 80 });

    // Subscribe exactly like <Board> does (no drag-state subscription) and count
    // renders. Drag state lives in the store, so flipping it must not re-render.
    let renders = 0;
    const { result } = renderHook(
      () => {
        renders++;
        return useBoardController(boardRef, trashRef);
      },
      { wrapper },
    );

    const el = {};
    const dblEvent = {
      target: el,
      currentTarget: el,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;
    act(() => result.current.onBoardDoubleClick(dblEvent));

    const id = result.current.noteIds[0];
    const rendersAfterCreate = renders;

    act(() => {
      result.current.noteHandlers.onMoveStart(id);
      result.current.noteHandlers.onMove(
        id,
        { x: 420, y: 710 },
        { x: 420, y: 710, width: 100, height: 100 },
      );
    });

    expect(renders).toBe(rendersAfterCreate);
  });
});
