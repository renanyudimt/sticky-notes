import { useMutation, useQueryClient } from "@tanstack/react-query";

import { buildSeedNotes, nextZIndex } from "@/components/notes/utils";
import { delay } from "@/components/shared";
import { toast } from "@/components/shared/components/ui";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes, saveNotes } from "../repository";
import type { DataSource, Note } from "../types";
import { NOTE_MUTATION_MESSAGES } from "./constants";

/**
 * "POST /notes/seed": waits out the latency, then appends `count` random empty
 * notes in a single write (not one request per note).
 */
async function seedNotesRequest(
  dataSource: DataSource,
  count: number,
): Promise<Note[]> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  const existing = readNotes(dataSource);
  const created = buildSeedNotes(count, nextZIndex(existing));
  saveNotes(dataSource, [...existing, ...created]);
  return created;
}

/** Seeds many empty cards at once (the "Simulate 100 empty cards" action). */
export function useSeedNotes(dataSource: DataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (count: number) => seedNotesRequest(dataSource, count),
    onSuccess: (created) => {
      queryClient.setQueryData<Note[]>(notesKeys.list(dataSource), (notes = []) => [
        ...notes,
        ...created,
      ]);
      toast.success(NOTE_MUTATION_MESSAGES.seeded(created.length));
    },
  });
}
