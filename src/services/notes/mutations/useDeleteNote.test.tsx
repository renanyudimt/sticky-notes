import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { Note } from "../types";
import { useDeleteNote } from "./useDeleteNote";
import { createMockNote } from "@/test/createMockNote";

describe("useDeleteNote", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should remove the note from the repository and the cache", async () => {
    saveNotes("local", [createMockNote(), createMockNote({ id: "note-2" })]);
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData(notesKeys.list("local"), [
      createMockNote(),
      createMockNote({ id: "note-2" }),
    ]);
    const { result } = renderHook(() => useDeleteNote("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync("note-1");
    });

    expect(readNotes("local")).toEqual([createMockNote({ id: "note-2" })]);
    expect(
      queryClient.getQueryData<Note[]>(notesKeys.list("local")),
    ).toEqual([createMockNote({ id: "note-2" })]);
  });
});
