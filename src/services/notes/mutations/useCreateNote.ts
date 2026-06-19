import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/components/notes/utils";
import { delay } from "@/components/shared";
import { toast } from "@/components/shared/components/ui";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { DataSource, CreateNoteInput, Note } from "../types";
import { NOTE_MUTATION_MESSAGES } from "./constants";

/** "POST /notes": waits out the latency, then appends the new note in storage. */
async function createNoteRequest(
  dataSource: DataSource,
  input: CreateNoteInput,
): Promise<Note> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  const note = createNote(input);
  saveNotes(dataSource, [...readNotes(dataSource), note]);
  return note;
}

/**
 * Creates a note through the simulated backend. On success it patches the cache
 * (no refetch — avoids a second latency round-trip) and fires the success toast.
 */
export function useCreateNote(dataSource: DataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateNoteInput) => createNoteRequest(dataSource, input),
    onSuccess: (note) => {
      queryClient.setQueryData<Note[]>(notesKeys.list(dataSource), (notes = []) => [
        ...notes,
        note,
      ]);
      toast.success(NOTE_MUTATION_MESSAGES.created);
    },
  });
}
