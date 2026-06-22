import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { NOTES_STORAGE_KEY, type Note } from "@/services/notes";

import { createNote } from "../../utils";
import type { NotesState } from "./types";

const creator: StateCreator<NotesState> = (set, get) => {
  const commit = (transform: (notes: Note[]) => Note[]) =>
    set((state) => ({ notes: transform(state.notes) }));

  return {
    notes: [],

    addNote: (input) => {
      const note = createNote(input);
      commit((notes) => [...notes, note]);
      return note;
    },

    patchNote: (id, changes) =>
      commit((notes) =>
        notes.map((note) =>
          note.id === id
            ? { ...note, ...changes, updatedAt: Date.now() }
            : note,
        ),
      ),

    bringToFront: (id) => {
      const { notes } = get();
      const index = notes.findIndex((note) => note.id === id);

      if (index === -1 || index === notes.length - 1) return;

      commit((current) => [
        ...current.slice(0, index),
        ...current.slice(index + 1),
        current[index],
      ]);
    },

    removeNote: (id) =>
      commit((notes) => notes.filter((note) => note.id !== id)),

    clear: () => commit(() => []),

    seed: (created) => commit((notes) => [...notes, ...created]),
  };
};

const partialize = (state: NotesState) => ({ notes: state.notes });

export const notesLocalStore = create<NotesState>()(
  persist(creator, {
    name: NOTES_STORAGE_KEY.local,
    storage: createJSONStorage(() => window.localStorage),
    partialize,
  }),
);
