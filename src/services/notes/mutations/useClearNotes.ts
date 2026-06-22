import { useMutation, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/components/shared";
import { toast } from "@/components/shared/components/ui";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { saveNotes } from "../repository";
import type { DataSource, Note } from "../types";
import { NOTE_MUTATION_MESSAGES } from "./constants";

/** "DELETE /notes": waits out the latency, then empties storage. */
async function clearNotesRequest(dataSource: DataSource): Promise<void> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  saveNotes(dataSource, []);
}

/**
 * Clears every note. Like delete, it is not optimistic — the confirm button
 * stays in a loading state until the "request" resolves, then the cache empties.
 */
export function useClearNotes(dataSource: DataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearNotesRequest(dataSource),
    onSuccess: () => {
      queryClient.setQueryData<Note[]>(notesKeys.list(dataSource), []);
      toast.success(NOTE_MUTATION_MESSAGES.cleared);
    },
  });
}
