import { DEFAULT_NOTE_SIZE, NOTE_COLOR_OPTIONS } from '../../constants';
import type { Note, NoteColor, Position } from '../../types';
import { createNote } from '../createNote';

/** Pick a random color from the existing palette. */
function randomColor(): NoteColor {
  const index = Math.floor(Math.random() * NOTE_COLOR_OPTIONS.length);
  return NOTE_COLOR_OPTIONS[index].value;
}

/** A random on-screen position that keeps the note within the viewport. */
function randomPosition(): Position {
  const viewportWidth = window.innerWidth || 1200;
  const viewportHeight = window.innerHeight || 800;
  const maxX = Math.max(0, viewportWidth - DEFAULT_NOTE_SIZE.width);
  const maxY = Math.max(0, viewportHeight - DEFAULT_NOTE_SIZE.height);

  return {
    x: Math.round(Math.random() * maxX),
    y: Math.round(Math.random() * maxY),
  };
}

/**
 * Build `count` empty notes scattered across the viewport with random palette
 * colors — backing the "Simulate 100 empty cards" action.
 */
export function buildSeedNotes(count: number): Note[] {
  return Array.from({ length: count }, () =>
    createNote({ position: randomPosition(), color: randomColor() }),
  );
}
