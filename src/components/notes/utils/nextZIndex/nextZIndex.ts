import type { Note } from '../../types';

/**
 * The next free stacking value: one above the current top note. Used when
 * creating a note or bringing one to front, so it lands above everything else.
 * Returns 0 for an empty board.
 */
export function nextZIndex(notes: Note[]): number {
  if (notes.length === 0) return 0;
  return Math.max(...notes.map((note) => note.zIndex)) + 1;
}
