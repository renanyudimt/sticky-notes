import { useShallow } from "zustand/react/shallow";

import { notesLocalStore } from "../notesLocalStore";

/**
 * The local notes' ids in stacking order. Shallow-compared, so it stays
 * referentially stable while a note merely moves/resizes (only add/remove/
 * reorder change it) — letting the board avoid re-rendering on every drag frame.
 */
export function useLocalNoteIds(): string[] {
  return notesLocalStore(useShallow((state) => state.notes.map((note) => note.id)));
}
