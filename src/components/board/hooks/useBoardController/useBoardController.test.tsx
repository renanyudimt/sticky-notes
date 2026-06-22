import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRef, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDragState,
  notesLocalStore,
  resetDataSourceStore,
  resetDragState,
  resetNotesStore,
} from "@/components/notes";

import { useBoardController } from "./useBoardController";

const fakeEl = (rect: Partial<DOMRect>) =>
  ({ getBoundingClientRect: () => rect as DOMRect }) as HTMLDivElement;

const dispatch = (type: string, clientX: number, clientY: number) => {
  window.dispatchEvent(new MouseEvent(type, { clientX, clientY }));
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const setup = () => {
  const boardRef = createRef<HTMLDivElement>();
  const trashRef = createRef<HTMLDivElement>();
  boardRef.current = fakeEl({ left: 0, top: 0, width: 1000, height: 800 });
  trashRef.current = fakeEl({ left: 400, top: 700, width: 200, height: 80 });

  // The controller exposes only note ids; pull the full list from the local
  // store alongside it so the assertions can still inspect positions.
  return renderHook(
    () => ({
      ...useBoardController(boardRef, trashRef),
      notes: notesLocalStore((state) => state.notes),
    }),
    { wrapper: createWrapper() },
  );
};

const doubleClickAt = (
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

const createNoteAt = async (
  result: ReturnType<typeof setup>["result"],
  x: number,
  y: number,
  expectedCount: number,
) => {
  doubleClickAt(result, x, y);
  await waitFor(() => expect(result.current.notes).toHaveLength(expectedCount));
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
    resetNotesStore();
    window.localStorage.clear();
    resetDragState();
  });

  afterEach(() => {
    resetNotesStore();
    resetDataSourceStore();
    window.localStorage.clear();
    resetDragState();
  });

  it("should start with no notes", () => {
    const { result } = setup();
    expect(result.current.notes).toHaveLength(0);
  });

  it("should create a default note centered on a double-click", async () => {
    const { result } = setup();

    await createNoteAt(result, 120, 140, 1);

    // 220x220 default note centered on the cursor: 120-110, 140-110
    expect(result.current.notes[0].position).toEqual({ x: 10, y: 30 });
  });

  it("should not create a note on a plain click", () => {
    const { result } = setup();

    clickBoardAt(result, 200, 200);

    expect(result.current.notes).toHaveLength(0);
  });

  it("should move a note via the move handler", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMove(
        id,
        { x: 250, y: 260 },
        { x: 250, y: 260, width: 220, height: 220 },
      ),
    );

    await waitFor(() =>
      expect(result.current.notes[0].position).toEqual({ x: 250, y: 260 }),
    );
  });

  it("should flag isOverTrash while moving onto the trash zone", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMove(
        id,
        { x: 420, y: 710 },
        { x: 420, y: 710, width: 100, height: 100 },
      ),
    );

    expect(getDragState().isOverTrash).toBe(true);
  });

  it("should delete the note when released over the trash zone", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMoveEnd(
        id,
        { x: 420, y: 710 },
        { x: 420, y: 710, width: 100, height: 100 },
      ),
    );

    await waitFor(() => expect(result.current.notes).toHaveLength(0));
  });

  it("should keep the note when released away from the trash zone", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMoveEnd(
        id,
        { x: 50, y: 50 },
        { x: 50, y: 50, width: 100, height: 100 },
      ),
    );

    expect(result.current.notes).toHaveLength(1);
    expect(getDragState().isOverTrash).toBe(false);
  });

  it("should bring the note to front when released away from the trash zone", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    await createNoteAt(result, 200, 200, 2);
    const id = result.current.notes[0].id;

    act(() =>
      result.current.noteHandlers.onMoveEnd(
        id,
        { x: 50, y: 50 },
        { x: 50, y: 50, width: 100, height: 100 },
      ),
    );

    const moved = result.current.notes.find((note) => note.id === id)!;
    const top = Math.max(...result.current.notes.map((note) => note.zIndex));
    expect(moved.zIndex).toBe(top);
  });

  it("should clear all notes", async () => {
    const { result } = setup();
    await createNoteAt(result, 100, 100, 1);
    await createNoteAt(result, 200, 200, 2);

    await act(async () => {
      await result.current.onClear();
    });

    await waitFor(() => expect(result.current.notes).toHaveLength(0));
  });

  it("should keep onSeed referentially stable across re-renders", () => {
    // The toolbar is memoized; an unstable onSeed would defeat its memo and
    // re-render it on every board render (e.g. when a create-drag starts).
    const { result, rerender } = setup();
    const first = result.current.onSeed;

    rerender();

    expect(result.current.onSeed).toBe(first);
  });

  it("should not re-render the board when drag/over-trash state changes", async () => {
    const boardRef = createRef<HTMLDivElement>();
    const trashRef = createRef<HTMLDivElement>();
    boardRef.current = fakeEl({ left: 0, top: 0, width: 1000, height: 800 });
    trashRef.current = fakeEl({ left: 400, top: 700, width: 200, height: 80 });

    // Subscribe exactly like <Board> does (no drag-state subscription) and count
    // renders. Drag state lives in its own store, so flipping it must not
    // re-render the board.
    let renders = 0;
    const { result } = renderHook(
      () => {
        renders++;
        return useBoardController(boardRef, trashRef);
      },
      { wrapper: createWrapper() },
    );

    const el = {};
    const dblEvent = {
      target: el,
      currentTarget: el,
      clientX: 100,
      clientY: 100,
    } as unknown as React.MouseEvent;
    act(() => result.current.onBoardDoubleClick(dblEvent));
    await waitFor(() => expect(result.current.noteIds).toHaveLength(1));

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
