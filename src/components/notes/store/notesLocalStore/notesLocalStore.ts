import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { NOTES_STORAGE_KEY } from "@/services/notes";

import { notesStoreCreator } from "../notesStoreCreator";
import type { NotesState } from "../types";

// Only the notes are persisted — actions are recreated on each load.
const partialize = (state: NotesState) => ({ notes: state.notes });

/**
 * The local backend. A Zustand store persisted to `localStorage` under the
 * local key. `createJSONStorage(localStorage)` is synchronous, so the store
 * hydrates eagerly at import — notes are on screen at first paint, with no
 * loading state (this is the user's own storage, not a network call).
 */
export const notesLocalStore = create<NotesState>()(
  persist(notesStoreCreator, {
    name: NOTES_STORAGE_KEY.local,
    storage: createJSONStorage(() => window.localStorage),
    partialize,
  }),
);
