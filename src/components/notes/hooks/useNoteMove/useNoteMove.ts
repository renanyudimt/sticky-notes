import { useRef } from "react";

import { usePointerDrag } from "@/components/shared";

import type { Position, Rect, Size } from "../../types";
import { clampPosition } from "../../utils";
import type { UseNoteMoveParams, UseNoteMoveResult } from "./types";

export function useNoteMove({
  note,
  getBoardRect,
  onMoveStart,
  onMove,
  onMoveEnd,
}: UseNoteMoveParams): UseNoteMoveResult {
  const originRef = useRef<Position>({ x: 0, y: 0 });
  const sizeRef = useRef<Size>(note.size);

  const toRect = (position: Position): Rect => ({
    x: position.x,
    y: position.y,
    width: sizeRef.current.width,
    height: sizeRef.current.height,
  });

  const resolve = (dx: number, dy: number): Position => {
    const board = getBoardRect();
    const next = { x: originRef.current.x + dx, y: originRef.current.y + dy };
    if (!board) return next;
    return clampPosition(next, sizeRef.current, {
      width: board.width,
      height: board.height,
    });
  };

  const { isDragging, startDrag } = usePointerDrag({
    onDragStart: () => {
      originRef.current = note.position;
      sizeRef.current = note.size;
      onMoveStart?.();
    },
    onDragMove: ({ dx, dy }) => {
      const position = resolve(dx, dy);
      onMove(position, toRect(position));
    },
    onDragEnd: ({ dx, dy }) => {
      const position = resolve(dx, dy);
      onMoveEnd(position, toRect(position));
    },
  });

  return { isMoving: isDragging, startMove: startDrag };
}
