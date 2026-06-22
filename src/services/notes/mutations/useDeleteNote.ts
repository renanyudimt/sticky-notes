import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/components/shared";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { DataSource, Note } from "../types";

/** "DELETE /notes/:id": waits out the latency, then removes the note in storage. */
async function deleteNoteRequest(dataSource: DataSource, id: string): Promise<void> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  saveNotes(
    dataSource,
    readNotes(dataSource).filter((note) => note.id !== id),
  );
}

/**
 * Deletes a note. Intentionally *not* optimistic: the card stays on screen with
 * its delete button in a loading state for the duration of the "request", then is
 * removed from the cache on success.
 */
export function useDeleteNote(dataSource: DataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNoteRequest(dataSource, id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Note[]>(notesKeys.list(dataSource), (notes = []) =>
        notes.filter((note) => note.id !== id),
      );
    },
  });
}
