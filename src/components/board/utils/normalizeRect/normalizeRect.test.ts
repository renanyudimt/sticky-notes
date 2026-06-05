import { describe, expect, it } from 'vitest';

import { normalizeRect } from './normalizeRect';

describe('normalizeRect', () => {
  it('should build a rect when dragging down-right', () => {
    expect(normalizeRect({ x: 10, y: 20 }, { x: 110, y: 220 })).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 200,
    });
  });

  it('should normalize a rect when dragging up-left', () => {
    expect(normalizeRect({ x: 110, y: 220 }, { x: 10, y: 20 })).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 200,
    });
  });

  it('should produce a zero-size rect for the same point', () => {
    expect(normalizeRect({ x: 5, y: 5 }, { x: 5, y: 5 })).toEqual({
      x: 5,
      y: 5,
      width: 0,
      height: 0,
    });
  });
});
