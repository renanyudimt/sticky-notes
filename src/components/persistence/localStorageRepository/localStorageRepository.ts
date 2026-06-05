import type { Note } from "@/components/notes";

import { LOCAL_STORAGE_KEY } from "../constants";
import type { NotesRepository } from "../types";
import { parseStoredNotes } from "../utils";

import type { LocalStorageRepositoryOptions } from "./types";

export function createLocalStorageRepository(
  options: LocalStorageRepositoryOptions = {},
): NotesRepository {
  const storage = options.storage ?? window.localStorage;
  const key = options.key ?? LOCAL_STORAGE_KEY;

  return {
    load() {
      return Promise.resolve(parseStoredNotes(storage.getItem(key)));
    },
    save(notes: readonly Note[]) {
      storage.setItem(key, JSON.stringify(notes));
      return Promise.resolve();
    },
  };
}
