import { LOCAL_STORAGE_KEY, REST_STORAGE_KEY } from "@/components/persistence";

import { useBackendStore } from "../backendStore";
import type { NotesState } from "../notesStoreCreator";
import {
  cancelPendingPersist,
  notesLocalStore,
  notesRestStore,
} from "../notesStores";

const cleanState: Pick<
  NotesState,
  "notes" | "status" | "draggingId" | "isOverTrash"
> = {
  notes: [],
  status: "ready",
  draggingId: null,
  isOverTrash: false,
};

/**
 * Reset both backend stores to a clean slate and clear their persisted keys.
 * Call in a test `beforeEach` — the stores are module-level singletons shared
 * across renders, so without this state leaks between tests. Cancels pending
 * debounced writes so a late flush can't repopulate storage mid-suite.
 */
export function resetNotesStores() {
  cancelPendingPersist();
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.localStorage.removeItem(REST_STORAGE_KEY);
  notesLocalStore.setState(cleanState);
  notesRestStore.setState(cleanState);
  useBackendStore.setState({ kind: "local" });
}
