import type { Note } from "@/components/notes";

import { MOCK_REST_LATENCY, REST_STORAGE_KEY } from "../constants";
import type { NotesRepository } from "../types";
import { parseStoredNotes } from "../utils";

import type { MockRestRepositoryOptions } from "./types";

const defaultDelay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export function createMockRestRepository(
  options: MockRestRepositoryOptions = {},
): NotesRepository {
  const storage = options.storage ?? window.localStorage;
  const key = options.key ?? REST_STORAGE_KEY;
  const latency = options.latency ?? MOCK_REST_LATENCY;
  const delay = options.delay ?? defaultDelay;

  return {
    async load() {
      await delay(latency);
      return parseStoredNotes(storage.getItem(key));
    },
    async save(notes: readonly Note[]) {
      await delay(latency);
      storage.setItem(key, JSON.stringify(notes));
    },
  };
}
