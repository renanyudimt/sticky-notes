import { useRef } from "react";

import { usePointerDrag } from "@/components/shared";

import { MAX_NOTE_SIZE, MIN_NOTE_SIZE } from "../../constants";
import type { Rect, ResizeDirection } from "../../types";
import { resizeRect } from "../../utils";
import type { UseNoteResizeParams, UseNoteResizeResult } from "./types";

export function useNoteResize({
  note,
  getBoardRect,
  onResizeStart,
  onResize,
  onResizeEnd,
}: UseNoteResizeParams): UseNoteResizeResult {
  const originRef = useRef<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const directionRef = useRef<ResizeDirection>("se");

  const resolve = (dx: number, dy: number): Rect => {
    const board = getBoardRect();
    const bounds = board
      ? { width: board.width, height: board.height }
      : { width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER };

    return resizeRect(
      originRef.current,
      directionRef.current,
      { dx, dy },
      {
        min: MIN_NOTE_SIZE,
        max: MAX_NOTE_SIZE,
        bounds,
      },
    );
  };

  const { isDragging, startDrag } = usePointerDrag({
    onDragStart: () => {
      originRef.current = {
        x: note.position.x,
        y: note.position.y,
        width: note.size.width,
        height: note.size.height,
      };
      onResizeStart?.();
    },
    onDragMove: ({ dx, dy }) => onResize(resolve(dx, dy)),
    onDragEnd: ({ dx, dy }) => onResizeEnd(resolve(dx, dy)),
  });

  const startResize = (
    direction: ResizeDirection,
    event: React.PointerEvent,
  ) => {
    directionRef.current = direction;
    startDrag(event);
  };

  return { isResizing: isDragging, startResize };
}
