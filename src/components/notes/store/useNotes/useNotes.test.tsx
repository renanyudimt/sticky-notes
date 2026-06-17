import { act, render, renderHook, screen } from "@/test/renderWithTheme";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetNotesStores } from "../testing";
import {
  useNote,
  useNoteActions,
  useNoteIds,
  useNotePendingDelete,
  useNotesList,
  useNotesStatus,
  useTrashActive,
} from "./useNotes";

describe("useNotes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStores();
  });

  it("should expose the current notes list", () => {
    const { result } = renderHook(() => ({
      list: useNotesList(),
      actions: useNoteActions(),
    }));

    expect(result.current.list).toHaveLength(0);

    act(() => {
      result.current.actions.addNote({ position: { x: 10, y: 10 } });
    });

    expect(result.current.list).toHaveLength(1);
  });

  it("should keep the id list referentially stable when a note moves", () => {
    const { result } = renderHook(() => ({
      ids: useNoteIds(),
      actions: useNoteActions(),
    }));

    let id = "";
    act(() => {
      id = result.current.actions.addNote({ position: { x: 0, y: 0 } }).id;
    });
    const idsAfterAdd = result.current.ids;

    act(() => {
      result.current.actions.moveNote(id, { x: 99, y: 99 });
    });

    // Moving a note must not produce a new id array (shallow-equal).
    expect(result.current.ids).toBe(idsAfterAdd);
  });

  it("should expose a single note by id and update only on its own change", () => {
    const { result } = renderHook(
      () => {
        const actions = useNoteActions();
        const ids = useNoteIds();
        const first = useNote(ids[0]);
        return { actions, ids, first };
      },
    );

    let id = "";
    act(() => {
      id = result.current.actions.addNote({ position: { x: 1, y: 2 } }).id;
    });

    expect(result.current.first?.id).toBe(id);

    act(() => {
      result.current.actions.moveNote(id, { x: 50, y: 60 });
    });

    expect(result.current.first?.position).toEqual({ x: 50, y: 60 });
  });

  it("should derive trash-active and per-note pending-delete from drag state", () => {
    const { result } = renderHook(
      () => {
        const actions = useNoteActions();
        const ids = useNoteIds();
        const id = ids[0];
        return {
          actions,
          id,
          trashActive: useTrashActive(),
          pending: useNotePendingDelete(id),
        };
      },
    );

    act(() => {
      result.current.actions.addNote({ position: { x: 0, y: 0 } });
    });
    const id = result.current.id;

    act(() => {
      result.current.actions.setDragging(id);
      result.current.actions.setOverTrash(true);
    });

    expect(result.current.trashActive).toBe(true);
    expect(result.current.pending).toBe(true);

    act(() => {
      result.current.actions.setOverTrash(false);
    });

    expect(result.current.trashActive).toBe(false);
    expect(result.current.pending).toBe(false);
  });

  it("should expose the active store status to consumers", () => {
    function StatusProbe() {
      const status = useNotesStatus();
      return <span>{status}</span>;
    }

    render(<StatusProbe />);

    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
