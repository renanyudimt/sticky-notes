import { createStore } from "zustand/vanilla";

import {
  createRepository,
  type NotesRepository,
  type RepositoryKind,
} from "@/components/persistence";
import { debounce } from "@/components/shared";

import type { Note } from "../../types";
import { createNote, nextZIndex } from "../../utils";
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
        const note = createNote({
          ...input,
          zIndex: input.zIndex ?? nextZIndex(get().notes),
        });
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
        const target = notes.find((note) => note.id === id);
        if (!target) return;

        const maxZ = notes.reduce((max, note) => Math.max(max, note.zIndex), 0);
        const isOnlyTop =
          target.zIndex === maxZ &&
          notes.filter((note) => note.zIndex === maxZ).length === 1;
        if (isOnlyTop) return;

        patch(id, { zIndex: maxZ + 1 });
      },

      removeNote: (id) => commit((notes) => notes.filter((n) => n.id !== id)),

      clear: () => commit(() => []),

      switchRepository: async (kind: RepositoryKind) => {
        repository = createRepository(kind);
        set({ repositoryKind: kind });
        await get().hydrate();
      },
    };
  });
}
