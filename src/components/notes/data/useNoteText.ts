import { useNotesQuery } from "@/services/notes";

import { useLocalNoteText } from "../store";
import { useDataSource } from "../dataSource";

/**
 * A single note's committed text for the active backend. A primitive selector,
 * so it re-renders only this note's editor when the text actually changes.
 */
export function useNoteText(id: string): string {
  const { dataSource } = useDataSource();
  const localText = useLocalNoteText(id);
  const apiText =
    useNotesQuery(
      "api",
      (notes) => notes.find((note) => note.id === id)?.text,
      dataSource === "api",
    ).data ?? "";

  return dataSource === "local" ? localText : apiText;
}
