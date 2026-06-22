// Local backend (Zustand store)
export { notesLocalStore } from "./notesLocalStore";
export type { NotesState } from "./notesLocalStore";

// Active backend toggle (Zustand store + hook)
export { dataSourceStore } from "./dataSourceStore";
export type { DataSourceState } from "./dataSourceStore";
export { useDataSource } from "./useDataSource";

// Read hooks (switch local ↔ api)
export { useNoteIds } from "./useNoteIds";
export { useNoteView } from "./useNoteView";
export { useNoteText } from "./useNoteText";
export { useNotesLoading } from "./useNotesLoading";
export { useNotesError } from "./useNotesError";

// Write surface
export { useNotesMutations } from "./useNotesMutations";
export type { NotesMutations } from "./useNotesMutations";

// API write activity (external store + hook)
export {
  beginActivity,
  endActivity,
  getActivityState,
  resetActivityState,
  subscribeActivity,
} from "./activityStore";
export type { ActivityState, NoteActivity } from "./activityStore";
export { useNotesActivity } from "./useNotesActivity";

// Ephemeral drag state (external store + hooks)
export {
  getDragState,
  resetDragState,
  setDragging,
  setOverTrash,
  subscribeDrag,
} from "./dragStore";
export type { DragState } from "./dragStore";
export { useTrashActive } from "./useTrashActive";
export { useNotePendingDelete } from "./useNotePendingDelete";

// Test helpers
export { resetNotesStore, resetDataSourceStore } from "./testing";
