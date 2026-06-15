import type { StoreApi } from "zustand";

import type { RepositoryKind } from "@/components/persistence";

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
  repositoryKind: RepositoryKind;

  /** Ephemeral drag UI state (never persisted). */
  draggingId: string | null;
  isOverTrash: boolean;

  hydrate: () => Promise<void>;
  addNote: (input: CreateNoteInput) => Note;
  moveNote: (id: string, position: Position) => void;
  resizeNote: (id: string, rect: Rect) => void;
  editNoteText: (id: string, text: string) => void;
  changeNoteColor: (id: string, color: NoteColor) => void;
  bringToFront: (id: string) => void;
  removeNote: (id: string) => void;
  clear: () => void;
  switchRepository: (kind: RepositoryKind) => Promise<void>;

  setDragging: (id: string | null) => void;
  setOverTrash: (isOverTrash: boolean) => void;
}

export type NotesStore = StoreApi<NotesState>;

export interface CreateNotesStoreOptions {
  persistDelay?: number;
  repositoryKind?: RepositoryKind;
}
