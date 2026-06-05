import { describe, expect, it } from 'vitest';

import type { Note } from '../../types';
import { nextZIndex } from './nextZIndex';

const noteWithZ = (zIndex: number): Note => ({
  id: `n-${zIndex}`,
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  text: '',
  color: 'yellow',
  zIndex,
  createdAt: 0,
  updatedAt: 0,
});

describe('nextZIndex', () => {
  it('should return 1 for an empty board', () => {
    expect(nextZIndex([])).toBe(1);
  });

  it('should return one above the current maximum', () => {
    expect(nextZIndex([noteWithZ(1), noteWithZ(5), noteWithZ(3)])).toBe(6);
  });
});
