import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "zustand/vanilla";

import { notesStoreCreator } from "./notesStoreCreator";

const setup = () => {
  const store = createStore(notesStoreCreator);
  const note = store.getState().addNote({ position: { x: 0, y: 0 } });
  return { store, id: note.id };
};

describe("notesStoreCreator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addNote", () => {
    it("should append a note and return it", () => {
      const store = createStore(notesStoreCreator);

      const note = store.getState().addNote({ position: { x: 5, y: 5 } });

      expect(store.getState().notes).toHaveLength(1);
      expect(store.getState().notes[0].id).toBe(note.id);
    });

    it("should stack each new note above the previous one", () => {
      const store = createStore(notesStoreCreator);

      store.getState().addNote({ position: { x: 0, y: 0 } });
      const second = store.getState().addNote({ position: { x: 0, y: 0 } });

      expect(store.getState().notes.at(-1)?.id).toBe(second.id);
    });
  });

  describe("mutations", () => {
    it("should move a note", () => {
      const { store, id } = setup();
      store.getState().moveNote(id, { x: 120, y: 80 });
      expect(store.getState().notes[0].position).toEqual({ x: 120, y: 80 });
    });

    it("should resize a note into position and size", () => {
      const { store, id } = setup();
      store.getState().resizeNote(id, { x: 10, y: 20, width: 300, height: 250 });
      expect(store.getState().notes[0].position).toEqual({ x: 10, y: 20 });
      expect(store.getState().notes[0].size).toEqual({
        width: 300,
        height: 250,
      });
    });

    it("should edit note text", () => {
      const { store, id } = setup();
      store.getState().editNoteText(id, "Buy milk");
      expect(store.getState().notes[0].text).toBe("Buy milk");
    });

    it("should change note color", () => {
      const { store, id } = setup();
      store.getState().changeNoteColor(id, "green");
      expect(store.getState().notes[0].color).toBe("green");
    });

    it("should remove a note", () => {
      const { store, id } = setup();
      store.getState().removeNote(id);
      expect(store.getState().notes).toHaveLength(0);
    });

    it("should clear all notes", () => {
      const { store } = setup();
      store.getState().addNote({ position: { x: 1, y: 1 } });
      store.getState().clear();
      expect(store.getState().notes).toHaveLength(0);
    });
  });

  describe("bringToFront", () => {
    it("should move a buried note to the end of the array", () => {
      const store = createStore(notesStoreCreator);
      const a = store.getState().addNote({ position: { x: 0, y: 0 } });
      store.getState().addNote({ position: { x: 0, y: 0 } });

      store.getState().bringToFront(a.id);

      expect(store.getState().notes.at(-1)?.id).toBe(a.id);
    });

    it("should preserve the relative order of the other notes", () => {
      const store = createStore(notesStoreCreator);
      const a = store.getState().addNote({ position: { x: 0, y: 0 } });
      const b = store.getState().addNote({ position: { x: 0, y: 0 } });
      const c = store.getState().addNote({ position: { x: 0, y: 0 } });

      store.getState().bringToFront(a.id);

      expect(store.getState().notes.map((n) => n.id)).toEqual([
        b.id,
        c.id,
        a.id,
      ]);
    });

    it("should be a no-op when the note is already on top", () => {
      const store = createStore(notesStoreCreator);
      store.getState().addNote({ position: { x: 0, y: 0 } });
      const top = store.getState().addNote({ position: { x: 0, y: 0 } });
      const before = store.getState().notes;

      store.getState().bringToFront(top.id);

      // Same array reference → no re-render, no persist.
      expect(store.getState().notes).toBe(before);
    });
  });

  describe("drag state", () => {
    it("should track the dragging note id", () => {
      const store = createStore(notesStoreCreator);

      store.getState().setDragging("note-1");
      expect(store.getState().draggingId).toBe("note-1");

      store.getState().setDragging(null);
      expect(store.getState().draggingId).toBeNull();
    });

    it("should track the over-trash flag", () => {
      const store = createStore(notesStoreCreator);

      store.getState().setOverTrash(true);
      expect(store.getState().isOverTrash).toBe(true);
    });
  });
});
