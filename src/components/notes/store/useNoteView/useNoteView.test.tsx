import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { notesLocalStore } from "../notesLocalStore";
import { resetNotesStore } from "../testing";
import { useNoteView } from "./useNoteView";
import { createMockNote } from "@/test/createMockNote";

describe("useNoteView", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should return the note's layout/style slice", () => {
    notesLocalStore.setState({
      notes: [createMockNote({ position: { x: 10, y: 20 }, color: "blue" })],
    });
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteView("note-1"), { wrapper });

    expect(result.current).toEqual({
      id: "note-1",
      position: { x: 10, y: 20 },
      size: { width: 220, height: 220 },
      color: "blue",
    });
  });

  it("should return undefined for an unknown id", () => {
    notesLocalStore.setState({ notes: [createMockNote()] });
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteView("missing"), { wrapper });

    expect(result.current).toBeUndefined();
  });
});
