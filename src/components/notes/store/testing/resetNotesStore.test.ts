import { afterEach, describe, expect, it } from "vitest";

import { NOTES_STORAGE_KEY } from "@/services/notes";

import { notesLocalStore } from "../notesLocalStore";
import { resetNotesStore } from "./resetNotesStore";

describe("resetNotesStore", () => {
  afterEach(() => {
    notesLocalStore.setState({ notes: [] });
    window.localStorage.clear();
  });

  it("should empty the notes and clear the persisted entry", () => {
    notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    resetNotesStore();

    expect(notesLocalStore.getState().notes).toEqual([]);
    expect(window.localStorage.getItem(NOTES_STORAGE_KEY.local)).toBeNull();
  });
});
