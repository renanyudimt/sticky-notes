import { useQuery } from "@tanstack/react-query";

import { delay } from "@/components/shared";

import { DATA_SOURCE_LATENCY } from "../constants";
import { notesKeys } from "../keys";
import { readNotes } from "../repository";
import type { DataSource, Note } from "../types";

/** The "GET /notes" request: waits out the backend latency, then reads storage. */
async function fetchNotes(dataSource: DataSource): Promise<Note[]> {
  await delay(DATA_SOURCE_LATENCY[dataSource]);
  return readNotes(dataSource);
}

/**
 * Reads the notes for a simulated *API* backend (the local backend uses the
 * Zustand store instead — see `@/components/notes/store`). Goes through
 * `fetchNotes` with latency, so it surfaces loading/error states.
 *
 * `enabled` gates the request: the data hooks always mount this for the `api`
 * source but only enable it while api is the active backend, so switching to
 * local never fires a stray fetch.
 *
 * Pass a `select` to subscribe to a derived slice (a single note, the ids, the
 * count). React Query applies structural sharing to the selected value, so a
 * card that selects its own note re-renders only when *that* note changes —
 * the same per-note granularity the Zustand selectors give the local backend.
 */
export function useNotesQuery<TData = Note[]>(
  dataSource: DataSource,
  select?: (notes: Note[]) => TData,
  enabled = true,
) {
  return useQuery({
    queryKey: notesKeys.list(dataSource),
    queryFn: () => fetchNotes(dataSource),
    enabled,
    // The repository is the single source and mutations keep the cache in sync,
    // so there's nothing to re-fetch in the background — never, which also keeps
    // a stray refetch from reverting an in-flight drag's cache-only patch.
    staleTime: Infinity,
    select,
  });
}
