import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { NotesRepository } from "@/components/persistence";

import type { Note } from "../../types";
import { createNotesStore } from "./createNotesStore";

const createMockRepository = (notes: Note[] = []): NotesRepository => ({
  load: vi.fn().mockResolvedValue(notes),
  save: vi.fn().mockResolvedValue(undefined),
});

describe("createNotesStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hydrate", () => {
    it("should load notes and mark the store ready", async () => {
      const note = { id: "n1" } as Note;
      const store = createNotesStore(createMockRepository([note]));

      await store.getState().hydrate();

      expect(store.getState().notes).toEqual([note]);
      expect(store.getState().status).toBe("ready");
    });

    it("should set error status when the repository rejects", async () => {
      const repo: NotesRepository = {
        load: vi.fn().mockRejectedValue(new Error("boom")),
        save: vi.fn(),
      };
      const store = createNotesStore(repo);

      await store.getState().hydrate();

      expect(store.getState().status).toBe("error");
    });
  });

  describe("addNote", () => {
    it("should append a note and return it", () => {
      const store = createNotesStore(createMockRepository(), {
        persistDelay: 0,
      });

      const note = store.getState().addNote({ position: { x: 5, y: 5 } });

      expect(store.getState().notes).toHaveLength(1);
      expect(store.getState().notes[0].id).toBe(note.id);
    });

    it("should stack each new note above the previous one", () => {
      const store = createNotesStore(createMockRepository(), {
        persistDelay: 0,
      });

      const first = store.getState().addNote({ position: { x: 0, y: 0 } });
      const second = store.getState().addNote({ position: { x: 0, y: 0 } });

      expect(second.zIndex).toBeGreaterThan(first.zIndex);
    });
  });

  describe("mutations", () => {
    const seed = () => {
      const store = createNotesStore(createMockRepository(), {
        persistDelay: 0,
      });
      const note = store.getState().addNote({ position: { x: 0, y: 0 } });
      return { store, id: note.id };
    };

    it("should move a note", () => {
      const { store, id } = seed();
      store.getState().moveNote(id, { x: 120, y: 80 });
      expect(store.getState().notes[0].position).toEqual({ x: 120, y: 80 });
    });

    it("should resize a note into position and size", () => {
      const { store, id } = seed();
      store
        .getState()
        .resizeNote(id, { x: 10, y: 20, width: 300, height: 250 });
      expect(store.getState().notes[0].position).toEqual({ x: 10, y: 20 });
      expect(store.getState().notes[0].size).toEqual({
        width: 300,
        height: 250,
      });
    });

    it("should edit note text", () => {
      const { store, id } = seed();
      store.getState().editNoteText(id, "Buy milk");
      expect(store.getState().notes[0].text).toBe("Buy milk");
    });

    it("should change note color", () => {
      const { store, id } = seed();
      store.getState().changeNoteColor(id, "green");
      expect(store.getState().notes[0].color).toBe("green");
    });

    it("should remove a note", () => {
      const { store, id } = seed();
      store.getState().removeNote(id);
      expect(store.getState().notes).toHaveLength(0);
    });

    it("should clear all notes", () => {
      const { store } = seed();
      store.getState().addNote({ position: { x: 1, y: 1 } });
      store.getState().clear();
      expect(store.getState().notes).toHaveLength(0);
    });
  });

  describe("bringToFront", () => {
    it("should raise a buried note above the others", () => {
      const store = createNotesStore(createMockRepository(), {
        persistDelay: 0,
      });
      const a = store.getState().addNote({ position: { x: 0, y: 0 } });
      const b = store.getState().addNote({ position: { x: 0, y: 0 } });

      store.getState().bringToFront(a.id);

      const raised = store.getState().notes.find((n) => n.id === a.id)!;
      const other = store.getState().notes.find((n) => n.id === b.id)!;
      expect(raised.zIndex).toBeGreaterThan(other.zIndex);
    });

    it("should be a no-op when the note is already on top", () => {
      const store = createNotesStore(createMockRepository(), {
        persistDelay: 0,
      });
      store.getState().addNote({ position: { x: 0, y: 0 } });
      const top = store.getState().addNote({ position: { x: 0, y: 0 } });
      const before = store
        .getState()
        .notes.find((n) => n.id === top.id)!.zIndex;

      store.getState().bringToFront(top.id);

      expect(store.getState().notes.find((n) => n.id === top.id)!.zIndex).toBe(
        before,
      );
    });
  });

  describe("persistence", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should save to the repository after the debounce window", () => {
      const repo = createMockRepository();
      const store = createNotesStore(repo, { persistDelay: 100 });

      store.getState().addNote({ position: { x: 0, y: 0 } });
      expect(repo.save).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
