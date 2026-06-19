import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/components/shared";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { DataSource, NoteChanges, Note, UpdateNotePayload } from "../types";

function applyChanges(notes: Note[], id: string, changes: NoteChanges): Note[] {
  return notes.map((note) =>
    note.id === id ? { ...note, ...changes, updatedAt: Date.now() } : note,
  );
}

/** "PATCH /notes/:id": waits out the latency, then patches the note in storage. */
async function updateNoteRequest(
  dataSource: DataSource,
  { id, changes }: UpdateNotePayload,
): Promise<void> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  saveNotes(dataSource, applyChanges(readNotes(dataSource), id, changes));
}

/**
 * Patches a note (text/color/move/resize). Optimistic: the cache updates on
 * `onMutate` so the board reflects the change instantly, even while the "request"
 * is in flight; a failure rolls back and the global handler shows the error.
 */
export function useUpdateNote(dataSource: DataSource) {
  const queryClient = useQueryClient();
  const listKey = notesKeys.list(dataSource);

  return useMutation({
    mutationFn: (payload: UpdateNotePayload) => updateNoteRequest(dataSource, payload),
    onMutate: async ({ id, changes }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<Note[]>(listKey);
      queryClient.setQueryData<Note[]>(listKey, (notes = []) =>
        applyChanges(notes, id, changes),
      );
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous);
      }
    },
  });
}
