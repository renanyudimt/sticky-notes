import { useShallow } from "zustand/react/shallow";

import type { NoteView } from "../../types";
import { notesLocalStore } from "../notesLocalStore";

/**
 * A single local note's layout/style slice, shallow-compared. Editing one note's
 * text leaves `position`/`size`/`color` untouched, so this bails — the card and
 * its chrome stay put while only the editor re-renders.
 */
export function useLocalNoteView(id: string): NoteView | undefined {
  return notesLocalStore(
    useShallow((state): NoteView | undefined => {
      const note = state.notes.find((item) => item.id === id);
      if (!note) return undefined;
      return {
        id: note.id,
        position: note.position,
        size: note.size,
        color: note.color,
      };
    }),
  );
}
