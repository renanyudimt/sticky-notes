import type { CreateNoteInput, NoteChanges } from "@/services/notes";

/**
 * The note write/interaction handlers the board uses, bound to the active
 * backend. `patchNote` is cache-only (per-frame drag, instant, no request);
 * `commitNote` persists through a mutation (drop, color). `bringToFront` is a
 * cache-only reorder. `deleteNote`/`clearNotes` resolve when the request settles,
 * so dialogs can show a loading state and close on success.
 */
export interface NotesMutations {
  createNote: (input: CreateNoteInput) => void;
  patchNote: (id: string, changes: NoteChanges) => void;
  commitNote: (id: string, changes: NoteChanges) => void;
  bringToFront: (id: string) => void;
  deleteNote: (id: string) => Promise<void>;
  clearNotes: () => Promise<void>;
  seedNotes: (count: number) => Promise<void>;
}
