import { notesLocalStore } from "../notesLocalStore";

/**
 * Reset the local store to its empty state and drop the persisted entry. Use in
 * test teardown — the store is a module singleton, so state would otherwise leak
 * between tests.
 */
export function resetNotesStore(): void {
  notesLocalStore.setState({ notes: [] });
  void notesLocalStore.persist.clearStorage();
}
