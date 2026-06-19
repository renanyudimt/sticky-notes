import { useNotesQuery } from "@/services/notes";

import { useLocalNoteIds } from "../store";
import { useDataSource } from "../dataSource";

// Stable empty reference for the loading/empty state — avoids a new array each
// render (which would re-render the board for nothing).
const EMPTY_IDS: string[] = [];

/**
 * The note ids in stacking order for the active backend. Local reads the Zustand
 * store; api reads the React Query cache (enabled only while api is active). Both
 * stay referentially stable while notes merely move/resize, so the board avoids
 * re-rendering on every drag frame.
 */
export function useNoteIds(): string[] {
  const { dataSource } = useDataSource();
  const localIds = useLocalNoteIds();
  const apiIds =
    useNotesQuery("api", (notes) => notes.map((note) => note.id), dataSource === "api")
      .data ?? EMPTY_IDS;

  return dataSource === "local" ? localIds : apiIds;
}
