import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { Note } from "../types";
import { useUpdateNote } from "./useUpdateNote";
import { createMockNote } from "@/test/createMockNote";

// Mock the repository so a write can be forced to fail (rollback path).
vi.mock("../repository", () => ({
  readNotes: vi.fn(() => []),
  saveNotes: vi.fn(),
}));

const mockSaveNotes = vi.mocked(saveNotes);

describe("useUpdateNote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readNotes).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should optimistically patch the note in the cache", async () => {
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData(notesKeys.list("local"), [createMockNote()]);
    const { result } = renderHook(() => useUpdateNote("local"), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: "note-1",
        changes: { color: "blue" },
      });
    });

    const cached = queryClient.getQueryData<Note[]>(notesKeys.list("local"));
    expect(cached?.[0].color).toBe("blue");
  });

  it("should roll back the cache when the request fails", async () => {
    mockSaveNotes.mockImplementation(() => {
      throw new Error("boom");
    });
    const { queryClient, wrapper } = createQueryWrapper();
    queryClient.setQueryData(notesKeys.list("local"), [createMockNote()]);
    const { result } = renderHook(() => useUpdateNote("local"), { wrapper });

    await act(async () => {
      await result.current
        .mutateAsync({ id: "note-1", changes: { color: "blue" } })
        .catch(() => undefined);
    });

    const cached = queryClient.getQueryData<Note[]>(notesKeys.list("local"));
    expect(cached?.[0].color).toBe("yellow");
  });
});
