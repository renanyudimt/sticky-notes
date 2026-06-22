import { useShallow } from "zustand/react/shallow";

import { useNotesQuery } from "@/services/notes";

import type { NoteView } from "../../types";
import { notesLocalStore } from "../notesLocalStore";
import { useDataSource } from "../useDataSource";
import { selectLocalNoteView } from "./selectLocalNoteView";

/**
 * A single note's layout/style fields for the active backend. Each card
 * subscribes to its own slice, so moving one note re-renders only that card —
 * its siblings keep their (shared) reference and bail.
 */
export function useNoteView(id: string): NoteView | undefined {
  const { dataSource } = useDataSource();
  const localView = notesLocalStore(
    useShallow((state) => selectLocalNoteView(state, id)),
  );
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
        zIndex: note.zIndex,
      };
    },
    dataSource === "api",
  ).data;

  return dataSource === "local" ? localView : apiView;
}
