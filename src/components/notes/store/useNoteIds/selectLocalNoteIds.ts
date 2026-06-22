import type { NotesState } from "../notesLocalStore";

export function selectLocalNoteIds(state: NotesState): string[] {
  return state.notes.map((note) => note.id);
}
