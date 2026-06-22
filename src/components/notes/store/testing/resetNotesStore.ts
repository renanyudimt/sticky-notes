import { notesLocalStore } from "../notesLocalStore";

export function resetNotesStore(): void {
  notesLocalStore.setState({ notes: [] });
  notesLocalStore.persist.clearStorage();
}
