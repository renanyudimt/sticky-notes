import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  notesKeys,
  useClearNotes,
  useCreateNote,
  useDeleteNote,
  useSeedNotes,
  useUpdateNote,
  type Note,
} from "@/services/notes";

import { beginActivity, endActivity } from "../activityState";
import type { NotesMutations } from "./types";

// The simulated-API backend is always keyed to "api" — local never routes here.
const API_SOURCE = "api" as const;

/**
 * The board's note actions bound to the simulated API backend (React Query).
 * `patchNote`/`bringToFront` are cache-only (instant, per-frame, no request);
 * the rest go through mutations that "round-trip" the repository. The returned
 * object is referentially stable across renders.
 */
export function useApiNotesMutations(): NotesMutations {
  const queryClient = useQueryClient();

  const { mutate: createMutate } = useCreateNote(API_SOURCE);
  const { mutate: updateMutate } = useUpdateNote(API_SOURCE);
  const { mutateAsync: deleteMutate } = useDeleteNote(API_SOURCE);
  const { mutateAsync: clearMutate } = useClearNotes(API_SOURCE);
  const { mutateAsync: seedMutate } = useSeedNotes(API_SOURCE);

  return useMemo<NotesMutations>(() => {
    const listKey = notesKeys.list(API_SOURCE);

    return {
      // Each write flips the header activity store for the duration of its
      // round-trip via React Query's per-call settle callback — no mutationKey
      // and no churn in the service layer. `onSettled` fires on success or error.
      createNote: (input) => {
        beginActivity("creating");
        createMutate(input, { onSettled: () => endActivity("creating") });
      },

      // Cache-only patch for the live gesture — instant, no request, no churn
      // beyond the dragged note.
      patchNote: (id, changes) =>
        queryClient.setQueryData<Note[]>(listKey, (notes = []) =>
          notes.map((note) => (note.id === id ? { ...note, ...changes } : note)),
        ),

      // Persists the change through the backend (drop / color change).
      commitNote: (id, changes) => {
        beginActivity("editing");
        updateMutate({ id, changes }, { onSettled: () => endActivity("editing") });
      },

      // Stacking is the array order; bringing to front = moving to the end.
      // Cache-only (no request) — order isn't worth a backend round-trip.
      bringToFront: (id) =>
        queryClient.setQueryData<Note[]>(listKey, (notes = []) => {
          const index = notes.findIndex((note) => note.id === id);
          if (index === -1 || index === notes.length - 1) return notes;
          return [
            ...notes.slice(0, index),
            ...notes.slice(index + 1),
            notes[index],
          ];
        }),

      deleteNote: (id) => {
        beginActivity("deleting");
        return deleteMutate(id).finally(() => endActivity("deleting"));
      },
      clearNotes: () => clearMutate(),
      seedNotes: (count) => seedMutate(count).then(() => undefined),
    };
  }, [
    queryClient,
    createMutate,
    updateMutate,
    deleteMutate,
    clearMutate,
    seedMutate,
  ]);
}
