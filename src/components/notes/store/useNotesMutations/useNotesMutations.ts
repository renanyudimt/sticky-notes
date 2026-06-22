import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useClearNotes,
  useCreateNote,
  useDeleteNote,
  useSeedNotes,
  useUpdateNote,
} from "@/services/notes";

import { useDataSource } from "../useDataSource";
import { buildNotesMutations } from "./utils";
import type { NotesMutations } from "./types";

export function useNotesMutations(): NotesMutations {
  const { dataSource } = useDataSource();
  const queryClient = useQueryClient();

  const { mutate: createMutate } = useCreateNote(dataSource);
  const { mutate: updateMutate } = useUpdateNote(dataSource);
  const { mutateAsync: deleteMutate } = useDeleteNote(dataSource);
  const { mutateAsync: clearMutate } = useClearNotes(dataSource);
  const { mutateAsync: seedMutate } = useSeedNotes(dataSource);

  return useMemo<NotesMutations>(
    () =>
      buildNotesMutations({
        dataSource,
        deps: {
          queryClient,
          createMutate,
          updateMutate,
          deleteMutate,
          clearMutate,
          seedMutate,
        },
      }),
    [
      dataSource,
      queryClient,
      createMutate,
      updateMutate,
      deleteMutate,
      clearMutate,
      seedMutate,
    ],
  );
}
