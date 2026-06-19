import { useNotesQuery } from "@/services/notes";

import type { NoteView } from "../types";
import { useLocalNoteView } from "../store";
import { useDataSource } from "../dataSource";

/**
 * A single note's layout/style fields for the active backend. Each card
 * subscribes to its own slice, so moving one note re-renders only that card —
 * its siblings keep their (shared) reference and bail.
 */
export function useNoteView(id: string): NoteView | undefined {
  const { dataSource } = useDataSource();
  const localView = useLocalNoteView(id);
  const apiView = useNotesQuery(
    "api",
    (notes): NoteView | undefined => {
      const note = notes.find((item) => item.id === id);
      if (!note) return undefined;
      return {
        id: note.id,
        position: note.position,
        size: note.size,
        color: note.color,
      };
    },
    dataSource === "api",
  ).data;

  return dataSource === "local" ? localView : apiView;
}
