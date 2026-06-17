import type {
  CreateNoteInput,
  Note,
  NoteColor,
  Position,
  Rect,
} from "../../types";

export type NotesStatus = "idle" | "loading" | "ready" | "error";

export interface NotesState {
  notes: Note[];
  status: NotesStatus;

  /** Ephemeral drag UI state (never persisted — see `partialize`). */
  draggingId: string | null;
  isOverTrash: boolean;

  addNote: (input: CreateNoteInput) => Note;
  moveNote: (id: string, position: Position) => void;
  resizeNote: (id: string, rect: Rect) => void;
  editNoteText: (id: string, text: string) => void;
  changeNoteColor: (id: string, color: NoteColor) => void;
  bringToFront: (id: string) => void;
  removeNote: (id: string) => void;
  clear: () => void;

  setDragging: (id: string | null) => void;
  setOverTrash: (isOverTrash: boolean) => void;
}
