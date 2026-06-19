import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { notesKeys } from "../keys";
import { readNotes } from "../repository";
import type { Note } from "../types";
import { useCreateNote } from "./useCreateNote";

describe("useCreateNote", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should persist a new note to the repository", async () => {
    const { wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateNote("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ position: { x: 10, y: 20 } });
    });

    expect(readNotes("local")).toHaveLength(1);
  });

  it("should add the created note to the query cache", async () => {
    const { queryClient, wrapper } = createQueryWrapper();
    const { result } = renderHook(() => useCreateNote("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ position: { x: 0, y: 0 } });
    });

    await waitFor(() =>
      expect(
        queryClient.getQueryData<Note[]>(notesKeys.list("local")),
      ).toHaveLength(1),
    );
  });
});
