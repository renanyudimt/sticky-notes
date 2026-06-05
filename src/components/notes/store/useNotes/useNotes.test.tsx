import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NotesRepository } from "@/components/persistence";

import { NotesProvider } from "../NotesProvider";
import { useNoteActions, useNotesList, useNotesStatus } from "./useNotes";

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
