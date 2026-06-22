import { DEFAULT_NOTE_SIZE, NOTE_COLOR_OPTIONS } from '../../constants';
import type { Note, NoteColor, Position } from '../../types';
import { createNote } from '../createNote';
import { randomInt } from '../randomInt';

/** Pick a random color from the existing palette. */
function randomColor(): NoteColor {
  const index = randomInt(NOTE_COLOR_OPTIONS.length);
  return NOTE_COLOR_OPTIONS[index].value;
}

/** A random on-screen position that keeps the note within the viewport. */
function randomPosition(): Position {
  const viewportWidth = window.innerWidth || 1200;
  const viewportHeight = window.innerHeight || 800;
  const maxX = Math.max(0, viewportWidth - DEFAULT_NOTE_SIZE.width);
  const maxY = Math.max(0, viewportHeight - DEFAULT_NOTE_SIZE.height);

  return {
    x: randomInt(maxX + 1),
    y: randomInt(maxY + 1),
  };
}

/**
 * Build `count` empty notes scattered across the viewport with random palette
 * colors — backing the "Simulate 100 empty cards" action. Each note gets a
 * distinct, increasing `zIndex` starting at `startZIndex` so they stack above
 * any existing notes (and above one another) in creation order.
 */
export function buildSeedNotes(count: number, startZIndex = 0): Note[] {
  return Array.from({ length: count }, (_, index) =>
    createNote(
      { position: randomPosition(), color: randomColor() },
      startZIndex + index,
    ),
  );
}
