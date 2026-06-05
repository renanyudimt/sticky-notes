import type { Position, Size } from '../../types';

/**
 * Keep a note (at `position` with `size`) fully inside a board of `bounds`.
 * If the note is larger than the board on an axis, it is pinned to the origin.
 */
export function clampPosition(
  position: Position,
  size: Size,
  bounds: Size,
): Position {
  const maxX = Math.max(0, bounds.width - size.width);
  const maxY = Math.max(0, bounds.height - size.height);

  return {
    x: Math.min(Math.max(position.x, 0), maxX),
    y: Math.min(Math.max(position.y, 0), maxY),
  };
}
