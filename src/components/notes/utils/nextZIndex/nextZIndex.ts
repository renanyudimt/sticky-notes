import type { Note } from '../../types';

/** The z-index that puts a note above every other note. */
export function nextZIndex(notes: readonly Note[]): number {
  if (notes.length === 0) return 1;
  return notes.reduce((max, note) => Math.max(max, note.zIndex), 0) + 1;
}
