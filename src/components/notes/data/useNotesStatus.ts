import { useNotesQuery } from "@/services/notes";

import { useDataSource } from "../dataSource";

/**
 * True while the active backend's notes are loading. Local is the Zustand store,
 * hydrated synchronously at import — it never loads. Only the api backend (a
 * latency-simulated fetch) surfaces a loading state.
 */
export function useNotesLoading(): boolean {
  const { dataSource } = useDataSource();
  // Reads only `isPending` — React Query's tracked-props default means data
  // changes (e.g. a drag frame) won't re-render this consumer.
  const apiPending = useNotesQuery("api", undefined, dataSource === "api").isPending;
  return dataSource === "api" ? apiPending : false;
}

/** True when the active backend's notes failed to load (api only). */
export function useNotesError(): boolean {
  const { dataSource } = useDataSource();
  const apiError = useNotesQuery("api", undefined, dataSource === "api").isError;
  return dataSource === "api" ? apiError : false;
}
