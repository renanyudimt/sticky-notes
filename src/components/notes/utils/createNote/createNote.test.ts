import { describe, expect, it } from 'vitest';

import {
  DEFAULT_NOTE_COLOR,
  DEFAULT_NOTE_SIZE,
  MIN_NOTE_SIZE,
} from '../../constants';
import { createNote } from './createNote';

describe('createNote', () => {
  it('should apply defaults when only a position is given', () => {
    const note = createNote({ position: { x: 10, y: 20 } });

    expect(note.position).toEqual({ x: 10, y: 20 });
    expect(note.size).toEqual(DEFAULT_NOTE_SIZE);
    expect(note.color).toBe(DEFAULT_NOTE_COLOR);
    expect(note.text).toBe('');
  });

  it('should default zIndex to 0 and use the value when provided', () => {
    expect(createNote({ position: { x: 0, y: 0 } }).zIndex).toBe(0);
    expect(createNote({ position: { x: 0, y: 0 } }, 7).zIndex).toBe(7);
  });

  it('should generate a unique id and matching timestamps', () => {
    const a = createNote({ position: { x: 0, y: 0 } });
    const b = createNote({ position: { x: 0, y: 0 } });

    expect(a.id).not.toBe(b.id);
    expect(a.createdAt).toBe(a.updatedAt);
  });

  it('should clamp a requested size below the minimum', () => {
    const note = createNote({
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
    });

    expect(note.size).toEqual(MIN_NOTE_SIZE);
  });

  it('should honour provided color and text', () => {
    const note = createNote({
      position: { x: 0, y: 0 },
      color: 'blue',
      text: 'hello',
    });

    expect(note.color).toBe('blue');
    expect(note.text).toBe('hello');
  });
});
