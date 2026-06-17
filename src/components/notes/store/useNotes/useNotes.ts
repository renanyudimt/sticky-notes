import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import type { NoteView } from "../../types";
import { useBackendStore } from "../backendStore";
import type { NotesState } from "../notesStoreCreator";
import { notesLocalStore, notesRestStore } from "../notesStores";

/** The store backing the active backend — switching kinds re-subscribes the hooks. */
function useActiveNotesStore() {
  const kind = useBackendStore((state) => state.kind);
  return kind === "rest" ? notesRestStore : notesLocalStore;
}

export function useNotesStore<T>(selector: (state: NotesState) => T): T {
  return useStore(useActiveNotesStore(), selector);
}

export function useNotesList() {
  return useNotesStore((state) => state.notes);
}

/**
 * The note ids in stacking order. Shallow-compared, so it stays referentially
 * stable while a note merely moves/resizes (only add/remove/reorder change it) —
 * letting the board subscribe without re-rendering on every drag frame.
 */
export function useNoteIds() {
  return useNotesStore(
    useShallow((state) => state.notes.map((note) => note.id)),
  );
}

/**
 * A single note by id. Each card subscribes to its own slice, so moving one note
 * re-renders only that card — its siblings keep their reference and bail.
 */
export function useNote(id: string) {
  return useNotesStore((state) => state.notes.find((note) => note.id === id));
}

/**
 * A single note's text. A primitive selector, so editing one note's text
 * re-renders only that note's editor — never the card chrome or its siblings.
 */
export function useNoteText(id: string) {
  return useNotesStore(
    (state) => state.notes.find((note) => note.id === id)?.text ?? "",
  );
}

/**
 * A note's layout/style fields, shallow-compared. Typing patches only `text`
 * (and `updatedAt`), so `position`/`size`/`color` keep their values and this
 * bails — the card and its chrome stay put while only the editor re-renders.
 */
export function useNoteView(id: string): NoteView | undefined {
  return useNotesStore(
    useShallow((state) => {
      const note = state.notes.find((item) => item.id === id);
      if (!note) return undefined;
      return {
        id: note.id,
        position: note.position,
        size: note.size,
        color: note.color,
      };
    }),
  );
}

/** True while a note is being dragged onto the trash zone. */
export function useTrashActive() {
  return useNotesStore(
    (state) => state.draggingId !== null && state.isOverTrash,
  );
}

/** True while this specific note is being dragged onto the trash zone. */
export function useNotePendingDelete(id: string) {
  return useNotesStore(
    (state) => state.draggingId === id && state.isOverTrash,
  );
}

export function useNotesStatus() {
  return useNotesStore((state) => state.status);
}

export function useRepositoryKind() {
  return useBackendStore((state) => state.kind);
}

export function useNoteActions() {
  return useNotesStore(
    useShallow((state) => ({
      addNote: state.addNote,
      moveNote: state.moveNote,
      resizeNote: state.resizeNote,
      editNoteText: state.editNoteText,
      changeNoteColor: state.changeNoteColor,
      bringToFront: state.bringToFront,
      removeNote: state.removeNote,
      clear: state.clear,
      setDragging: state.setDragging,
      setOverTrash: state.setOverTrash,
    })),
  );
}
