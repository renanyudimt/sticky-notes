import { createStore } from "zustand";
import { beforeEach, describe, expect, it } from "vitest";

import type { NotesState } from "../types";
import { notesStoreCreator } from "./notesStoreCreator";

const createTestStore = () => createStore<NotesState>(notesStoreCreator);

describe("notesStoreCreator", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it("should start with no notes", () => {
    expect(store.getState().notes).toEqual([]);
  });

  it("should append a created note and return it", () => {
    const note = store.getState().addNote({ position: { x: 10, y: 20 } });

    expect(store.getState().notes).toEqual([note]);
    expect(note.position).toEqual({ x: 10, y: 20 });
  });

  it("should patch a note's fields and bump updatedAt", () => {
    const note = store.getState().addNote({ position: { x: 0, y: 0 } });

    store.getState().patchNote(note.id, { color: "blue" });

    const patched = store.getState().notes[0];
    expect(patched.color).toBe("blue");
    expect(patched.updatedAt).toBeGreaterThanOrEqual(note.updatedAt);
  });

  it("should move a note to the end on bringToFront", () => {
    const a = store.getState().addNote({ position: { x: 0, y: 0 } });
    const b = store.getState().addNote({ position: { x: 0, y: 0 } });
    const c = store.getState().addNote({ position: { x: 0, y: 0 } });

    store.getState().bringToFront(a.id);

    expect(store.getState().notes.map((note) => note.id)).toEqual([
      b.id,
      c.id,
      a.id,
    ]);
  });

  it("should keep the same array reference when bringing an unknown id to front", () => {
    store.getState().addNote({ position: { x: 0, y: 0 } });
    const before = store.getState().notes;

    store.getState().bringToFront("missing");

    expect(store.getState().notes).toBe(before);
  });

  it("should remove a note by id", () => {
    const a = store.getState().addNote({ position: { x: 0, y: 0 } });
    const b = store.getState().addNote({ position: { x: 0, y: 0 } });

    store.getState().removeNote(a.id);

    expect(store.getState().notes.map((note) => note.id)).toEqual([b.id]);
  });

  it("should drop every note on clear", () => {
    store.getState().addNote({ position: { x: 0, y: 0 } });

    store.getState().clear();

    expect(store.getState().notes).toEqual([]);
  });

  it("should append a batch of notes on seed", () => {
    const existing = store.getState().addNote({ position: { x: 0, y: 0 } });
    const seeded = [
      store.getState().addNote({ position: { x: 1, y: 1 } }),
    ];
    // addNote already appended `seeded[0]`; reset and seed explicitly instead.
    store.setState({ notes: [existing] });

    store.getState().seed(seeded);

    expect(store.getState().notes.map((note) => note.id)).toEqual([
      existing.id,
      seeded[0].id,
    ]);
  });
});
