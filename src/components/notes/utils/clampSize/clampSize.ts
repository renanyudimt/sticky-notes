import type { Size, SizeConstraints } from '../../types';

/** Clamp a size within the given min/max constraints, per axis. */
export function clampSize(size: Size, { min, max }: SizeConstraints): Size {
  return {
    width: Math.min(Math.max(size.width, min.width), max.width),
    height: Math.min(Math.max(size.height, min.height), max.height),
  };
}
