import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import type { Note } from "../types";
import { notesLocalStore, resetNotesStore } from "../store";
import { useNoteText } from "./useNoteText";

const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: "note-1",
  position: { x: 0, y: 0 },
  size: { width: 220, height: 220 },
  text: "buy milk",
  color: "yellow",
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe("useNoteText", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should return the note's text", () => {
    notesLocalStore.setState({ notes: [createMockNote()] });
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteText("note-1"), { wrapper });

    expect(result.current).toBe("buy milk");
  });

  it("should return an empty string for an unknown id", () => {
    notesLocalStore.setState({ notes: [createMockNote()] });
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteText("missing"), { wrapper });

    expect(result.current).toBe("");
  });
});
