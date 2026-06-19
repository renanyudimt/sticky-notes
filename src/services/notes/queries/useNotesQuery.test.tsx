import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createQueryWrapper } from "@/test/queryWrapper";

import { saveNotes } from "../repository";
import type { Note } from "../types";
import { useNotesQuery } from "./useNotesQuery";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "Reminder",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe("useNotesQuery", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("should start in a loading state for the api backend", () => {
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useNotesQuery("api"), { wrapper });

    expect(result.current.isPending).toBe(true);
  });

  it("should resolve api notes after the latency", async () => {
    saveNotes("api", [createMockNote({ id: "api-note" })]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useNotesQuery("api"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([createMockNote({ id: "api-note" })]);
  });

  it("should not fetch while disabled", () => {
    saveNotes("api", [createMockNote()]);
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(
      () => useNotesQuery("api", undefined, false),
      { wrapper },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });
});
