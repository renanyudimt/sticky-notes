import { describe, expect, it } from 'vitest';

import { clampPosition } from './clampPosition';

const size = { width: 100, height: 100 };
const bounds = { width: 800, height: 600 };

describe('clampPosition', () => {
  it('should keep a position that is fully inside the board', () => {
    expect(clampPosition({ x: 200, y: 150 }, size, bounds)).toEqual({
      x: 200,
      y: 150,
    });
  });

  it('should clamp negative coordinates to the origin', () => {
    expect(clampPosition({ x: -50, y: -10 }, size, bounds)).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('should clamp so the note does not overflow the right/bottom edges', () => {
    expect(clampPosition({ x: 999, y: 999 }, size, bounds)).toEqual({
      x: 700,
      y: 500,
    });
  });

  it('should pin to origin when the note is larger than the board', () => {
    expect(
      clampPosition({ x: 30, y: 30 }, { width: 900, height: 700 }, bounds),
    ).toEqual({ x: 0, y: 0 });
  });
});
