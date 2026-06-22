import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { saveNotes } from "@/services/notes";
import { createNotesHookWrapper } from "@/test/notesHookWrapper";

import { notesLocalStore } from "../notesLocalStore";
import { resetNotesStore } from "../testing";
import { useNoteIds } from "./useNoteIds";
import { createMockNote } from "@/test/createMockNote";

describe("useNoteIds", () => {
  beforeEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    window.localStorage.clear();
  });

  it("should return an empty array when there are no notes", () => {
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteIds(), { wrapper });

    expect(result.current).toEqual([]);
  });

  it("should return the local ids in order", () => {
    notesLocalStore.setState({
      notes: [createMockNote({ id: "a" }), createMockNote({ id: "b" })],
    });
    const { wrapper } = createNotesHookWrapper();

    const { result } = renderHook(() => useNoteIds(), { wrapper });

    expect(result.current).toEqual(["a", "b"]);
  });

  it("should read from the api backend when api is active", async () => {
    saveNotes("api", [createMockNote({ id: "x" }), createMockNote({ id: "y" })]);
    const { wrapper } = createNotesHookWrapper("api");

    const { result } = renderHook(() => useNoteIds(), { wrapper });

    await waitFor(() => expect(result.current).toEqual(["x", "y"]));
  });
});
