import { describe, expect, it } from 'vitest';

import type { Rect } from '../../types';
import { rectsIntersect } from './rectsIntersect';

const base: Rect = { x: 0, y: 0, width: 100, height: 100 };

describe('rectsIntersect', () => {
  it('should detect overlapping rectangles', () => {
    expect(rectsIntersect(base, { x: 50, y: 50, width: 100, height: 100 })).toBe(
      true,
    );
  });

  it('should return false for fully separated rectangles', () => {
    expect(
      rectsIntersect(base, { x: 200, y: 200, width: 50, height: 50 }),
    ).toBe(false);
  });

  it('should return false when only edges touch', () => {
    expect(rectsIntersect(base, { x: 100, y: 0, width: 50, height: 50 })).toBe(
      false,
    );
  });

  it('should detect containment', () => {
    expect(rectsIntersect(base, { x: 10, y: 10, width: 20, height: 20 })).toBe(
      true,
    );
  });
});
