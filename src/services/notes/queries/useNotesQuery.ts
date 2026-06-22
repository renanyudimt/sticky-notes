import { useQuery } from "@tanstack/react-query";

import { delay } from "@/components/shared";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes } from "../repository";
import type { DataSource, Note } from "../types";

async function fetchNotes(dataSource: DataSource): Promise<Note[]> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  return readNotes(dataSource);
}

export function useNotesQuery<TData = Note[]>(
  dataSource: DataSource,
  select?: (notes: Note[]) => TData,
  enabled = true,
) {
  return useQuery({
    queryKey: notesKeys.list(dataSource),
    queryFn: () => fetchNotes(dataSource),
    enabled,
    select,
  });
}
