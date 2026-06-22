export * from './types';
export {
  DEFAULT_NOTE_COLOR,
  DEFAULT_NOTE_SIZE,
  MAX_NOTE_SIZE,
  MIN_NOTE_SIZE,
  CREATE_DRAG_THRESHOLD,
  NOTE_COLOR_OPTIONS,
} from './constants';
export {
  buildSeedNotes,
  clampPosition,
  clampSize,
  createNote,
  generateId,
  rectsIntersect,
  resizeRect,
} from './utils';
export type { ResizeConstraints } from './utils';
export {
  notesLocalStore,
  dataSourceStore,
  useDataSource,
  useNoteIds,
  useNoteView,
  useNoteText,
  useNotesLoading,
  useNotesError,
  useNotesMutations,
  resetNotesStore,
  resetDataSourceStore,
  getDragState,
  resetDragState,
  setDragging,
  setOverTrash,
  useNotePendingDelete,
  useTrashActive,
  beginActivity,
  endActivity,
  resetActivityState,
  useNotesActivity,
} from './store';
export type { NotesMutations, NoteActivity } from './store';
export { useNoteMove, useNoteResize } from './hooks';
export {
  NoteCard,
  NoteCardConnector,
  NoteCardHeader,
  NoteColorPicker,
  NoteEditor,
  NoteEditorConnector,
  ResizeHandle,
} from './components';
export type {
  NoteCardProps,
  NoteCardConnectorProps,
  NoteCardHeaderProps,
  NoteEditorConnectorProps,
} from './components';
