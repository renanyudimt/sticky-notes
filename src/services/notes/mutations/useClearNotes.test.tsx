import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { Note } from "../types";
import { useClearNotes } from "./useClearNotes";
import { createMockNote } from "@/test/createMockNote";

describe("useClearNotes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should empty the repository and the cache", async () => {
    saveNotes("local", [createMockNote(), createMockNote({ id: "note-2" })]);
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData(notesKeys.list("local"), [createMockNote()]);
    const { result } = renderHook(() => useClearNotes("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(readNotes("local")).toEqual([]);
    expect(queryClient.getQueryData<Note[]>(notesKeys.list("local"))).toEqual(
      [],
    );
  });
});
