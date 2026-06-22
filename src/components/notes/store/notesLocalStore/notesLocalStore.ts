import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { NOTES_STORAGE_KEY, type Note } from "@/services/notes";

import { createNote, nextZIndex } from "../../utils";
import type { NotesState } from "./types";

const creator: StateCreator<NotesState> = (set, get) => {
  const commit = (transform: (notes: Note[]) => Note[]) =>
    set((state) => ({ notes: transform(state.notes) }));

  return {
    notes: [],

    addNote: (input) => {
      const note = createNote(input, nextZIndex(get().notes));
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
      const note = notes.find((item) => item.id === id);
      if (!note) return;

      const top = Math.max(...notes.map((item) => item.zIndex));
      const isUniqueTop =
        note.zIndex === top &&
        notes.filter((item) => item.zIndex === top).length === 1;
      if (isUniqueTop) return;

      commit((current) =>
        current.map((item) =>
          item.id === id ? { ...item, zIndex: top + 1 } : item,
        ),
      );
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
