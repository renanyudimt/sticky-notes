import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { notesLocalStore } from "../notesLocalStore";
import { resetNotesStore } from "../testing";
import { useNoteText } from "./useNoteText";
import { createMockNote } from "@/test/createMockNote";

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
    notesLocalStore.setState({ notes: [createMockNote({ text: "buy milk" })] });
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
