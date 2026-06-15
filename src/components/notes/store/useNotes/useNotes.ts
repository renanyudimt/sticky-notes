import { useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { NotesStoreContext } from "../NotesProvider";
import type { NotesState } from "../createNotesStore";

function useStoreApi() {
  const store = useContext(NotesStoreContext);
  if (store === null) {
    throw new Error("useNotes hooks must be used within a NotesProvider");
  }
  return store;
}

export function useNotesStore<T>(selector: (state: NotesState) => T): T {
  return useStore(useStoreApi(), selector);
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
  return useNotesStore((state) => state.repositoryKind);
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
      switchRepository: state.switchRepository,
      setDragging: state.setDragging,
      setOverTrash: state.setOverTrash,
    })),
  );
}
