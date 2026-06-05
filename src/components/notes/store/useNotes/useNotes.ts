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
    })),
  );
}
