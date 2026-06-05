import type { NoteColor, NoteColorOption, Size } from './types';

export const DEFAULT_NOTE_SIZE: Size = { width: 220, height: 220 };
export const MIN_NOTE_SIZE: Size = { width: 140, height: 120 };
export const MAX_NOTE_SIZE: Size = { width: 640, height: 640 };

/**
 * Minimum pointer travel (px) for a board drag to be treated as
 * "draw a note of this size" instead of a plain click (default-size note).
 */
export const CREATE_DRAG_THRESHOLD = 16;

export const DEFAULT_NOTE_COLOR: NoteColor = 'yellow';

export const NOTE_COLOR_OPTIONS: readonly NoteColorOption[] = [
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
];
