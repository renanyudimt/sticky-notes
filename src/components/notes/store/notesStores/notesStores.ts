import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  createDebouncedStorage,
  createRestStorage,
  LOCAL_STORAGE_KEY,
  REST_STORAGE_KEY,
  type RepositoryKind,
} from "@/components/persistence";

import { delay } from "@/components/shared";

import { useBackendStore } from "../backendStore";
import { MIN_LOADING_MS, PERSIST_DEBOUNCE } from "../constants";
import { notesStoreCreator, type NotesState } from "../notesStoreCreator";

// Only the notes are persisted — drag/status are ephemeral and must not survive
// a reload or leak into storage.
const partialize = (state: NotesState) => ({ notes: state.notes });

// Held as module references so tests can flush their pending debounced writes.
const localStorageAdapter = createDebouncedStorage(
  window.localStorage,
  PERSIST_DEBOUNCE,
);
const restStorageAdapter = createDebouncedStorage(
  createRestStorage(),
  PERSIST_DEBOUNCE,
);

/**
 * Local backend: synchronous localStorage, debounced writes. Hydrates eagerly at
 * import (cheap + sync), so notes are there on first paint with no loading state.
 */
export const notesLocalStore = create<NotesState>()(
  persist(notesStoreCreator, {
    name: LOCAL_STORAGE_KEY,
    storage: createJSONStorage(() => localStorageAdapter),
    partialize,
  }),
);

/**
 * Rest backend: an async storage with latency standing in for a real API.
 * `skipHydration` keeps it from fetching at boot — the "backend call" only fires
 * when the user switches to it (see `switchBackend`).
 */
export const notesRestStore = create<NotesState>()(
  persist(notesStoreCreator, {
    name: REST_STORAGE_KEY,
    storage: createJSONStorage(() => restStorageAdapter),
    partialize,
    skipHydration: true,
  }),
);

/** Drop any pending debounced writes (test teardown). */
export function cancelPendingPersist() {
  localStorageAdapter.cancel();
  restStorageAdapter.cancel();
}

/**
 * Activate a backend. Switching to `rest` triggers the (latent) fetch, surfacing
 * a loading state while the async storage resolves — this is the "backend call".
 * The loading state is floored at `MIN_LOADING_MS` (the floor runs in parallel
 * with the fetch, so total wait is `max(fetch, floor)`) so a fast resolve can't
 * flash by unseen. On failure we surface `error` immediately, without the floor.
 */
export async function switchBackend(kind: RepositoryKind) {
  useBackendStore.getState().setKind(kind);
  if (kind !== "rest") return;

  notesRestStore.setState({ status: "loading" });
  const floor = delay(MIN_LOADING_MS);
  try {
    await notesRestStore.persist.rehydrate();
    await floor;
    notesRestStore.setState({ status: "ready" });
  } catch {
    notesRestStore.setState({ status: "error" });
  }
}
