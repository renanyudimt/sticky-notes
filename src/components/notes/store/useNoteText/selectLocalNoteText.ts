import type { NotesState } from "../notesLocalStore";

/** A single local note's text, or an empty string when the id is unknown. */
export function selectLocalNoteText(state: NotesState, id: string): string {
  return state.notes.find((note) => note.id === id)?.text ?? "";
}
