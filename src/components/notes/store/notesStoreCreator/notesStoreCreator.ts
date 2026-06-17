import type { StateCreator } from "zustand";

import type { Note } from "../../types";
import { createNote } from "../../utils";

import type { NotesState } from "./types";

/**
 * The shared notes state + actions, free of any persistence concern — each
 * backend store applies the `persist` middleware around this with its own
 * storage. Saving/loading is the middleware's job; this only mutates state.
 */
export const notesStoreCreator: StateCreator<NotesState> = (set, get) => {
  const commit = (transform: (notes: Note[]) => Note[]) =>
    set((state) => ({ notes: transform(state.notes) }));

  const patch = (id: string, changes: Partial<Note>) =>
    commit((notes) =>
      notes.map((note) =>
        note.id === id ? { ...note, ...changes, updatedAt: Date.now() } : note,
      ),
    );

  return {
    notes: [],
    status: "ready",
    draggingId: null,
    isOverTrash: false,

    addNote: (input) => {
      const note = createNote(input);
      // Appended last → rendered on top. Stacking is the array order.
      commit((notes) => [...notes, note]);
      return note;
    },

    moveNote: (id, position) => patch(id, { position }),

    resizeNote: (id, rect) =>
      patch(id, {
        position: { x: rect.x, y: rect.y },
        size: { width: rect.width, height: rect.height },
      }),

    editNoteText: (id, text) => patch(id, { text }),

    changeNoteColor: (id, color) => patch(id, { color }),

    bringToFront: (id) => {
      const { notes } = get();
      const index = notes.findIndex((note) => note.id === id);
      // Stacking is the array order: the last note renders on top. Bringing a
      // note to front = moving it to the end. No-op if missing or already last
      // (returns the same array reference, so no re-render / persist).
      if (index === -1 || index === notes.length - 1) return;

      commit((current) => [
        ...current.slice(0, index),
        ...current.slice(index + 1),
        current[index],
      ]);
    },

    removeNote: (id) => commit((notes) => notes.filter((n) => n.id !== id)),

    clear: () => commit(() => []),

    // Ephemeral drag UI state — kept in the store (not component state) so only
    // the trash zone and the dragged note re-render when it flips, never the board.
    setDragging: (id) => set({ draggingId: id }),
    setOverTrash: (isOverTrash) => set({ isOverTrash }),
  };
};
