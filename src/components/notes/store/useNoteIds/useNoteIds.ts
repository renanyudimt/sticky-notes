import { useShallow } from "zustand/react/shallow";

import { useNotesQuery } from "@/services/notes";

import { notesLocalStore } from "../notesLocalStore";
import { useDataSource } from "../useDataSource";
import { selectLocalNoteIds } from "./selectLocalNoteIds";

const EMPTY_IDS: string[] = [];

export function useNoteIds(): string[] {
  const { dataSource } = useDataSource();
  const localIds = notesLocalStore(useShallow(selectLocalNoteIds));
  const apiIds =
    useNotesQuery(
      "api",
      (notes) => notes.map((note) => note.id),
      dataSource === "api",
    ).data ?? EMPTY_IDS;

  return dataSource === "local" ? localIds : apiIds;
}
