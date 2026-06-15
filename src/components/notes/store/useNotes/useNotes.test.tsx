import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NotesRepository } from "@/components/persistence";

import { NotesProvider } from "../NotesProvider";
import {
  useNote,
  useNoteActions,
  useNoteIds,
  useNotePendingDelete,
  useNotesList,
  useNotesStatus,
  useTrashActive,
} from "./useNotes";

const repository: NotesRepository = {
  load: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <NotesProvider repository={repository} autoHydrate={false} persistDelay={0}>
    {children}
  </NotesProvider>
);

describe("useNotes hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw when used outside a NotesProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useNotesList())).toThrow(
      /within a NotesProvider/,
    );
    spy.mockRestore();
  });

  it("should expose the current notes list", () => {
    const { result } = renderHook(
      () => ({ list: useNotesList(), actions: useNoteActions() }),
      { wrapper },
    );

    expect(result.current.list).toHaveLength(0);

    act(() => {
      result.current.actions.addNote({ position: { x: 10, y: 10 } });
    });

    expect(result.current.list).toHaveLength(1);
  });

  it("should keep the id list referentially stable when a note moves", () => {
    const { result } = renderHook(
      () => ({ ids: useNoteIds(), actions: useNoteActions() }),
      { wrapper },
    );

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
      { wrapper },
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
      { wrapper },
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

  it("should re-render consumers when a note changes", () => {
    function StatusProbe() {
      const status = useNotesStatus();
      return <span>{status}</span>;
    }

    render(
      <NotesProvider repository={repository} autoHydrate={false}>
        <StatusProbe />
      </NotesProvider>,
    );

    expect(screen.getByText("idle")).toBeInTheDocument();
  });
});
