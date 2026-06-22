import { useNotesQuery } from "@/services/notes";

import { notesLocalStore } from "../notesLocalStore";
import { useDataSource } from "../useDataSource";
import { selectLocalNoteText } from "./selectLocalNoteText";

export function useNoteText(id: string): string {
  const { dataSource } = useDataSource();
  const localText = notesLocalStore((state) => selectLocalNoteText(state, id));
  const apiText =
    useNotesQuery(
      "api",
      (notes) => notes.find((note) => note.id === id)?.text,
      dataSource === "api",
    ).data ?? "";

  return dataSource === "local" ? localText : apiText;
}
