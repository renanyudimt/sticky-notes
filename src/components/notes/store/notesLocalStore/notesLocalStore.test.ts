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

  it("should start with no notes", () => {
    expect(notesLocalStore.getState().notes).toEqual([]);
  });

  it("should append a created note and return it", () => {
    const note = notesLocalStore.getState().addNote({ position: { x: 10, y: 20 } });

    expect(notesLocalStore.getState().notes).toEqual([note]);
    expect(note.position).toEqual({ x: 10, y: 20 });
  });

  it("should patch a note's fields and bump updatedAt", () => {
    const note = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    notesLocalStore.getState().patchNote(note.id, { color: "blue" });

    const patched = notesLocalStore.getState().notes[0];
    expect(patched.color).toBe("blue");
    expect(patched.updatedAt).toBeGreaterThanOrEqual(note.updatedAt);
  });

  it("should move a note to the end on bringToFront", () => {
    const a = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    const b = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    const c = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    notesLocalStore.getState().bringToFront(a.id);

    expect(notesLocalStore.getState().notes.map((note) => note.id)).toEqual([
      b.id,
      c.id,
      a.id,
    ]);
  });

  it("should keep the same array reference when bringing an unknown id to front", () => {
    notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    const before = notesLocalStore.getState().notes;

    notesLocalStore.getState().bringToFront("missing");

    expect(notesLocalStore.getState().notes).toBe(before);
  });

  it("should remove a note by id", () => {
    const a = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    const b = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    notesLocalStore.getState().removeNote(a.id);

    expect(notesLocalStore.getState().notes.map((note) => note.id)).toEqual([b.id]);
  });

  it("should drop every note on clear", () => {
    notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });

    notesLocalStore.getState().clear();

    expect(notesLocalStore.getState().notes).toEqual([]);
  });

  it("should append a batch of notes on seed", () => {
    const existing = notesLocalStore.getState().addNote({ position: { x: 0, y: 0 } });
    const seeded = [
      notesLocalStore.getState().addNote({ position: { x: 1, y: 1 } }),
    ];
    // addNote already appended `seeded[0]`; reset and seed explicitly instead.
    notesLocalStore.setState({ notes: [existing] });

    notesLocalStore.getState().seed(seeded);

    expect(notesLocalStore.getState().notes.map((note) => note.id)).toEqual([
      existing.id,
      seeded[0].id,
    ]);
  });

  it("should persist created notes under the local storage key", () => {
    notesLocalStore.getState().addNote({ position: { x: 5, y: 6 } });

    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY.local);
    expect(raw).not.toBeNull();
    expect(raw).toContain('"notes"');
  });
});
