import type { NotesState } from "../notesLocalStore";

/**
 * The local notes' ids in stacking order. Shallow-compared by the consuming
 * hook, so it stays referentially stable while a note merely moves/resizes
 * (only add/remove/reorder change it) — letting the board avoid re-rendering on
 * every drag frame.
 */
export function selectLocalNoteIds(state: NotesState): string[] {
  return state.notes.map((note) => note.id);
}
