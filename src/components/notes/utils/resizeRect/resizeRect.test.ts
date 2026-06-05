import { describe, expect, it } from 'vitest';

import type { Rect } from '../../types';
import { resizeRect } from './resizeRect';
import type { ResizeConstraints } from './types';

const origin: Rect = { x: 100, y: 100, width: 200, height: 200 };

const constraints: ResizeConstraints = {
  min: { width: 80, height: 80 },
  max: { width: 600, height: 600 },
  bounds: { width: 1000, height: 1000 },
};

describe('resizeRect', () => {
  it('should grow width to the east keeping the left edge fixed', () => {
    expect(resizeRect(origin, 'e', { dx: 50, dy: 0 }, constraints)).toEqual({
      x: 100,
      y: 100,
      width: 250,
      height: 200,
    });
  });

  it('should grow to the south-east on a corner handle', () => {
    expect(resizeRect(origin, 'se', { dx: 40, dy: 60 }, constraints)).toEqual({
      x: 100,
      y: 100,
      width: 240,
      height: 260,
    });
  });

  it('should move the left edge when dragging west, keeping the right edge fixed', () => {
    expect(resizeRect(origin, 'w', { dx: -30, dy: 0 }, constraints)).toEqual({
      x: 70,
      y: 100,
      width: 230,
      height: 200,
    });
  });

  it('should move the top edge when dragging north, keeping the bottom edge fixed', () => {
    expect(resizeRect(origin, 'n', { dx: 0, dy: -40 }, constraints)).toEqual({
      x: 100,
      y: 60,
      width: 200,
      height: 240,
    });
  });

  it('should not shrink below the minimum size', () => {
    const result = resizeRect(origin, 'se', { dx: -500, dy: -500 }, constraints);
    expect(result.width).toBe(80);
    expect(result.height).toBe(80);
  });

  it('should not grow past the board bounds when resizing east', () => {
    const tight: ResizeConstraints = {
      ...constraints,
      bounds: { width: 360, height: 1000 },
    };
    // origin.x = 100, available width = 260
    expect(resizeRect(origin, 'e', { dx: 999, dy: 0 }, tight).width).toBe(260);
  });

  it('should keep the bottom edge pinned and never go above the board top', () => {
    const result = resizeRect(origin, 'n', { dx: 0, dy: -999 }, constraints);
    // bottom stays at 300; top cannot pass 0, so height capped at 300
    expect(result.y).toBe(0);
    expect(result.height).toBe(300);
  });
});
