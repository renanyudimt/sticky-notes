import { createStore } from "zustand/vanilla";

import {
  createRepository,
  type NotesRepository,
  type RepositoryKind,
} from "@/components/persistence";
import { debounce } from "@/components/shared";

import type { Note } from "../../types";
import { createNote } from "../../utils";
import { PERSIST_DEBOUNCE } from "../constants";
import type { CreateNotesStoreOptions, NotesState, NotesStore } from "./types";

export function createNotesStore(
  initialRepository: NotesRepository,
  options: CreateNotesStoreOptions = {},
): NotesStore {
  let repository = initialRepository;
  const persistDelay = options.persistDelay ?? PERSIST_DEBOUNCE;

  return createStore<NotesState>((set, get) => {
    const persist = debounce(() => {
      void repository.save(get().notes);
    }, persistDelay);

    const commit = (transform: (notes: Note[]) => Note[]) => {
      set((state) => ({ notes: transform(state.notes) }));
      persist();
    };

    const patch = (id: string, changes: Partial<Note>) =>
      commit((notes) =>
        notes.map((note) =>
          note.id === id
            ? { ...note, ...changes, updatedAt: Date.now() }
            : note,
        ),
      );

    return {
      notes: [],
      status: "idle",
      repositoryKind: options.repositoryKind ?? "local",
      draggingId: null,
      isOverTrash: false,

      hydrate: async () => {
        set({ status: "loading" });
        try {
          const notes = await repository.load();
          set({ notes, status: "ready" });
        } catch {
          set({ status: "error" });
        }
      },

      addNote: (input) => {
        const note = createNote(input);
        // Appended last → rendered on top. Stacking is the array order.
        commit((notes) => [...notes, note]);
        return note;
      },

      moveNote: (id, position) => patch(id, { position }),

      resizeNote: (id, rect) =>
        patch(id, {
          position: { x: rect.x, y: rect.y },
          size: { width: rect.width, height: rect.height },
        }),

      editNoteText: (id, text) => patch(id, { text }),

      changeNoteColor: (id, color) => patch(id, { color }),

      bringToFront: (id) => {
        const { notes } = get();
        const index = notes.findIndex((note) => note.id === id);
        // Stacking is the array order: the last note renders on top. Bringing a
        // note to front = moving it to the end. No-op if missing or already last
        // (returns the same array reference, so no re-render / persist).
        if (index === -1 || index === notes.length - 1) return;

        commit((current) => [
          ...current.slice(0, index),
          ...current.slice(index + 1),
          current[index],
        ]);
      },

      removeNote: (id) => commit((notes) => notes.filter((n) => n.id !== id)),

      clear: () => commit(() => []),

      switchRepository: async (kind: RepositoryKind) => {
        repository = createRepository(kind);
        set({ repositoryKind: kind });
        await get().hydrate();
      },

      // Ephemeral drag UI state — kept here (not in component state) so only the
      // trash zone and the dragged note re-render when it flips, never the board.
      setDragging: (id) => set({ draggingId: id }),
      setOverTrash: (isOverTrash) => set({ isOverTrash }),
    };
  });
}
