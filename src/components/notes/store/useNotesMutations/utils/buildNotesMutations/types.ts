import type { QueryClient } from "@tanstack/react-query";

import type {
  useClearNotes,
  useCreateNote,
  useDeleteNote,
  useSeedNotes,
  useUpdateNote,
} from "@/services/notes";

/**
 * The React Query handles the `api` backend needs from the host hook. Each
 * `*Mutate` is the bound callback from the matching mutation hook (mutate for
 * fire-and-forget writes, mutateAsync where the caller awaits the round-trip).
 */
export interface ApiMutationsDeps {
  queryClient: QueryClient;
  createMutate: ReturnType<typeof useCreateNote>["mutate"];
  updateMutate: ReturnType<typeof useUpdateNote>["mutate"];
  deleteMutate: ReturnType<typeof useDeleteNote>["mutateAsync"];
  clearMutate: ReturnType<typeof useClearNotes>["mutateAsync"];
  seedMutate: ReturnType<typeof useSeedNotes>["mutateAsync"];
}

/**
 * Selects which backend `buildNotesMutations` wires. `local` needs nothing (it
 * talks straight to the Zustand store); `api` carries the React Query handles the
 * host hook mounted.
 */
export type NotesMutationsConfig =
  | { dataSource: "local" }
  | { dataSource: "api"; deps: ApiMutationsDeps };
