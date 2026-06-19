import { useDataSource } from "../dataSource";
import { useApiNotesMutations } from "./useApiNotesMutations";
import { useLocalNotesMutations } from "./useLocalNotesMutations";
import type { NotesMutations } from "./types";

/**
 * The board's note actions bound to the active backend. Routes to the Zustand
 * store for `local` and to React Query for `api` — both implementations are
 * mounted (Rules of Hooks), and the active one is returned. Each is referentially
 * stable, so memoized cards don't re-render when the inactive backend churns.
 */
export function useNotesMutations(): NotesMutations {
  const { dataSource } = useDataSource();
  const localMutations = useLocalNotesMutations();
  const apiMutations = useApiNotesMutations();

  return dataSource === "local" ? localMutations : apiMutations;
}
