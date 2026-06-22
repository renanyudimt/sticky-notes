import type { CreateNoteInput, Note, NoteChanges } from "@/services/notes";

/**
 * The local backend's notes state + actions. Mirrors the write surface the data
 * layer needs (`NotesMutations`), kept free of any persistence concern — the
 * `persist` middleware around the creator is what touches storage.
 */
export interface NotesState {
  notes: Note[];

  /** Create + append a note (rendered on top — stacking is the array order). */
  addNote: (input: CreateNoteInput) => Note;
  /** Patch a single note's layout/style/text fields, bumping `updatedAt`. */
  patchNote: (id: string, changes: NoteChanges) => void;
  /** Move a note to the end of the array (= render it on top). */
  bringToFront: (id: string) => void;
  /** Remove a note by id. */
  removeNote: (id: string) => void;
  /** Drop every note. */
  clear: () => void;
  /** Append a batch of pre-built notes (the "Simulate N cards" action). */
  seed: (notes: Note[]) => void;
}
