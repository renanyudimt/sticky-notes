import type { NoteView } from "../../types";
import type { NotesState } from "../notesLocalStore";

/**
 * A single local note's layout/style slice. Shallow-compared by the consuming
 * hook, so editing one note's text (which leaves `position`/`size`/`color`
 * untouched) lets the card and its chrome stay put while only the editor
 * re-renders.
 */
export function selectLocalNoteView(
  state: NotesState,
  id: string,
): NoteView | undefined {
  const note = state.notes.find((item) => item.id === id);
  if (!note) return undefined;
  return {
    id: note.id,
    position: note.position,
    size: note.size,
    color: note.color,
    zIndex: note.zIndex,
  };
}
