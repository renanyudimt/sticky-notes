import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { NOTES_STORAGE_KEY } from "@/services/notes";

import { notesLocalStore } from "./notesLocalStore";

describe("notesLocalStore", () => {
  beforeEach(() => {
    notesLocalStore.setState({ notes: [] });
    window.localStorage.clear();
  });

  afterEach(() => {
    notesLocalStore.setState({ notes: [] });
    window.localStorage.clear();
  });

  it("should persist created notes under the local storage key", () => {
    notesLocalStore.getState().addNote({ position: { x: 5, y: 6 } });

    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY.local);
    expect(raw).not.toBeNull();
    expect(raw).toContain('"notes"');
  });

  it("should expose the created note through getState", () => {
    const note = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    expect(notesLocalStore.getState().notes).toEqual([note]);
  });
});
