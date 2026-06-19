import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { notesKeys } from "../keys";
import { readNotes } from "../repository";
import type { Note } from "../types";
import { useSeedNotes } from "./useSeedNotes";

describe("useSeedNotes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should append the seeded notes to the repository and the cache", async () => {
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData(notesKeys.list("local"), []);
    const { result } = renderHook(() => useSeedNotes("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(5);
    });

    expect(readNotes("local")).toHaveLength(5);
    expect(
      queryClient.getQueryData<Note[]>(notesKeys.list("local")),
    ).toHaveLength(5);
  });
});
