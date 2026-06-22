import { notesKeys, NOTE_MUTATION_MESSAGES, type Note } from "@/services/notes";

import { buildSeedNotes, nextZIndex } from "@/components/notes/utils";
import { toast } from "@/components/shared/components/ui";

import { beginActivity, endActivity } from "../../../activityStore";
import { notesLocalStore } from "../../../notesLocalStore";
import type { NotesMutations } from "../../types";
import type { NotesMutationsConfig } from "./types";

export function buildNotesMutations(
  config: NotesMutationsConfig,
): NotesMutations {
  const store = () => notesLocalStore.getState();
  const listKey = notesKeys.list(config.dataSource);

  return {
    createNote: (input) => {
      if (config.dataSource === "local") {
        store().addNote(input);
        toast.success(NOTE_MUTATION_MESSAGES.created);
        return;
      }

      beginActivity("creating");
      config.deps.createMutate(input, {
        onSettled: () => endActivity("creating"),
      });
    },

    patchNote: (id, changes) => {
      if (config.dataSource === "local") return store().patchNote(id, changes);
      config.deps.queryClient.setQueryData<Note[]>(listKey, (notes = []) =>
        notes.map((note) => (note.id === id ? { ...note, ...changes } : note)),
      );
    },

    commitNote: (id, changes) => {
      if (config.dataSource === "local") return store().patchNote(id, changes);
      beginActivity("editing");
      config.deps.updateMutate(
        { id, changes },
        { onSettled: () => endActivity("editing") },
      );
    },

    bringToFront: (id) => {
      if (config.dataSource === "local") return store().bringToFront(id);
      config.deps.queryClient.setQueryData<Note[]>(listKey, (notes = []) => {
        const note = notes.find((item) => item.id === id);
        if (!note) return notes;

        const top = Math.max(...notes.map((item) => item.zIndex));
        const isUniqueTop =
          note.zIndex === top &&
          notes.filter((item) => item.zIndex === top).length === 1;
        if (isUniqueTop) return notes;

        return notes.map((item) =>
          item.id === id ? { ...item, zIndex: top + 1 } : item,
        );
      });
    },

    deleteNote: (id) => {
      if (config.dataSource === "local") {
        store().removeNote(id);
        return Promise.resolve();
      }
      beginActivity("deleting");
      return config.deps
        .deleteMutate(id)
        .finally(() => endActivity("deleting"));
    },

    clearNotes: () => {
      if (config.dataSource === "local") {
        store().clear();
        toast.success(NOTE_MUTATION_MESSAGES.cleared);
        return Promise.resolve();
      }
      return config.deps.clearMutate();
    },

    seedNotes: (count) => {
      if (config.dataSource === "local") {
        const created = buildSeedNotes(count, nextZIndex(store().notes));
        store().seed(created);
        toast.success(NOTE_MUTATION_MESSAGES.seeded(created.length));
        return Promise.resolve();
      }
      return config.deps.seedMutate(count).then(() => undefined);
    },
  };
}
