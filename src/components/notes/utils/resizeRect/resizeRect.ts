import type { DragDelta } from "@/components/shared";

import type { Rect, ResizeDirection } from "../../types";

import type { ResizeConstraints } from "./types";

const movesEast = (d: ResizeDirection) => d === "e" || d === "ne" || d === "se";
const movesWest = (d: ResizeDirection) => d === "w" || d === "nw" || d === "sw";
const movesSouth = (d: ResizeDirection) =>
  d === "s" || d === "se" || d === "sw";
const movesNorth = (d: ResizeDirection) =>
  d === "n" || d === "ne" || d === "nw";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Compute a new rectangle from the rect captured at gesture start, the active
 * handle and the pointer delta. The edge(s) opposite to the dragged handle stay
 * pinned; size is clamped to [min, max] and to the available board space so the
 * note can never grow outside `bounds`.
 */
export function resizeRect(
  origin: Rect,
  direction: ResizeDirection,
  delta: DragDelta,
  { min, max, bounds }: ResizeConstraints,
): Rect {
  let { x, y, width, height } = origin;

  if (movesEast(direction)) {
    const maxWidth = Math.min(max.width, bounds.width - origin.x);
    width = clamp(origin.width + delta.dx, min.width, maxWidth);
  } else if (movesWest(direction)) {
    const right = origin.x + origin.width;
    const maxWidth = Math.min(max.width, right);
    width = clamp(origin.width - delta.dx, min.width, maxWidth);
    x = right - width;
  }

  if (movesSouth(direction)) {
    const maxHeight = Math.min(max.height, bounds.height - origin.y);
    height = clamp(origin.height + delta.dy, min.height, maxHeight);
  } else if (movesNorth(direction)) {
    const bottom = origin.y + origin.height;
    const maxHeight = Math.min(max.height, bottom);
    height = clamp(origin.height - delta.dy, min.height, maxHeight);
    y = bottom - height;
  }

  return { x, y, width, height };
}
