import { useMemo } from "react";

import { buildSeedNotes } from "@/components/notes/utils";
import { NOTE_MUTATION_MESSAGES } from "@/services/notes";
import { toast } from "@/components/shared/components/ui";

import { notesLocalStore } from "../store";
import type { NotesMutations } from "./types";

/**
 * The board's note actions bound to the local backend (Zustand). Synchronous —
 * every action goes straight to the store (which persists itself), so the async
 * handlers resolve immediately. Mirrors the success toasts the API backend fires,
 * so the UX is identical across modes. The returned object is stable across
 * renders (the store actions never change identity).
 */
export function useLocalNotesMutations(): NotesMutations {
  return useMemo<NotesMutations>(() => {
    const store = () => notesLocalStore.getState();

    return {
      createNote: (input) => {
        store().addNote(input);
        toast.success(NOTE_MUTATION_MESSAGES.created);
      },

      // Local has no cache/request split: both the live patch and the commit
      // write straight to the store.
      patchNote: (id, changes) => store().patchNote(id, changes),
      commitNote: (id, changes) => store().patchNote(id, changes),

      bringToFront: (id) => store().bringToFront(id),

      deleteNote: (id) => {
        store().removeNote(id);
        return Promise.resolve();
      },

      clearNotes: () => {
        store().clear();
        toast.success(NOTE_MUTATION_MESSAGES.cleared);
        return Promise.resolve();
      },

      seedNotes: (count) => {
        const created = buildSeedNotes(count);
        store().seed(created);
        toast.success(NOTE_MUTATION_MESSAGES.seeded(created.length));
        return Promise.resolve();
      },
    };
  }, []);
}
