import type { StateCreator } from "zustand";

import type { Note } from "@/services/notes";

import { createNote } from "../../utils";
import type { NotesState } from "../types";

/**
 * The local notes state + actions, free of any persistence concern — the
 * `persist` middleware wraps this with its own storage. Saving/loading is the
 * middleware's job; this only mutates state.
 */
export const notesStoreCreator: StateCreator<NotesState> = (set, get) => {
  const commit = (transform: (notes: Note[]) => Note[]) =>
    set((state) => ({ notes: transform(state.notes) }));

  return {
    notes: [],

    addNote: (input) => {
      const note = createNote(input);
      // Appended last → rendered on top. Stacking is the array order.
      commit((notes) => [...notes, note]);
      return note;
    },

    patchNote: (id, changes) =>
      commit((notes) =>
        notes.map((note) =>
          note.id === id ? { ...note, ...changes, updatedAt: Date.now() } : note,
        ),
      ),

    bringToFront: (id) => {
      const { notes } = get();
      const index = notes.findIndex((note) => note.id === id);
      // No-op if missing or already last (returns the same array reference, so
      // no re-render / persist).
      if (index === -1 || index === notes.length - 1) return;

      commit((current) => [
        ...current.slice(0, index),
        ...current.slice(index + 1),
        current[index],
      ]);
    },

    removeNote: (id) => commit((notes) => notes.filter((note) => note.id !== id)),

    clear: () => commit(() => []),

    seed: (created) => commit((notes) => [...notes, ...created]),
  };
};
