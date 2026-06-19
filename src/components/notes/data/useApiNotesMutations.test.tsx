import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readNotes, saveNotes } from "@/services/notes";
import { createQueryWrapper } from "@/test/queryWrapper";

import type { Note } from "../types";
import { useApiNotesMutations } from "./useApiNotesMutations";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

const LIST_KEY = ["notes", "api"];

describe("useApiNotesMutations", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should expose a stable reference across renders", () => {
    const { wrapper } = createQueryWrapper();
    const { result, rerender } = renderHook(() => useApiNotesMutations(), {
      wrapper,
    });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("should patch a note in the cache without touching the repository", () => {
    saveNotes("api", [createMockNote()]);
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData<Note[]>(LIST_KEY, [createMockNote()]);
    const { result } = renderHook(() => useApiNotesMutations(), { wrapper });

    act(() => result.current.patchNote("note-1", { color: "blue" }));

    expect(queryClient.getQueryData<Note[]>(LIST_KEY)?.[0].color).toBe("blue");
    // Repository untouched — patch is cache-only.
    expect(readNotes("api")[0].color).toBe("yellow");
  });

  it("should move a note to the end of the array on bringToFront", () => {
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData<Note[]>(LIST_KEY, [
      createMockNote({ id: "a" }),
      createMockNote({ id: "b" }),
      createMockNote({ id: "c" }),
    ]);
    const { result } = renderHook(() => useApiNotesMutations(), { wrapper });

    act(() => result.current.bringToFront("a"));

    expect(
      queryClient.getQueryData<Note[]>(LIST_KEY)?.map((note) => note.id),
    ).toEqual(["b", "c", "a"]);
  });

  it("should delete a note through the repository", async () => {
    saveNotes("api", [createMockNote(), createMockNote({ id: "note-2" })]);
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData<Note[]>(LIST_KEY, [
      createMockNote(),
      createMockNote({ id: "note-2" }),
    ]);
    const { result } = renderHook(() => useApiNotesMutations(), { wrapper });

    await act(async () => {
      await result.current.deleteNote("note-1");
    });

    expect(readNotes("api").map((note) => note.id)).toEqual(["note-2"]);
  });
});
