import { describe, expect, it } from 'vitest';

import { NOTE_COLOR_OPTIONS } from '../../constants';
import { buildSeedNotes } from './buildSeedNotes';

const PALETTE = new Set(NOTE_COLOR_OPTIONS.map((option) => option.value));

describe('buildSeedNotes', () => {
  it('should build the requested number of notes', () => {
    expect(buildSeedNotes(100)).toHaveLength(100);
  });

  it('should build empty notes', () => {
    const notes = buildSeedNotes(10);

    expect(notes.every((note) => note.text === '')).toBe(true);
  });

  it('should only use colors from the existing palette', () => {
    const notes = buildSeedNotes(50);

    expect(notes.every((note) => PALETTE.has(note.color))).toBe(true);
  });

  it('should give every note a unique id', () => {
    const notes = buildSeedNotes(50);

    expect(new Set(notes.map((note) => note.id)).size).toBe(notes.length);
  });

  it('should assign distinct increasing zIndex from the start value', () => {
    const notes = buildSeedNotes(3, 10);

    expect(notes.map((note) => note.zIndex)).toEqual([10, 11, 12]);
  });

  it('should return an empty array for a count of zero', () => {
    expect(buildSeedNotes(0)).toEqual([]);
  });
});
