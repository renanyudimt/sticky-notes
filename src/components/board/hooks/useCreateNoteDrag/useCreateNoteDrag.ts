import { useRef, useState } from "react";

import {
  CREATE_DRAG_THRESHOLD,
  type Position,
  type Rect,
} from "@/components/notes";
import { usePointerDrag } from "@/components/shared";

import { normalizeRect } from "../../utils";
import type { UseCreateNoteDragParams, UseCreateNoteDragResult } from "./types";

const clamp = (value: number, max: number) =>
  Math.min(Math.max(value, 0), Math.max(max, 0));

export function useCreateNoteDrag({
  getBoardRect,
  onCreate,
}: UseCreateNoteDragParams): UseCreateNoteDragResult {
  const [previewRect, setPreviewRect] = useState<Rect | null>(null);
  const originRef = useRef<Position>({ x: 0, y: 0 });
  const boardRef = useRef<DOMRect | null>(null);

  const toBoardPoint = (clientX: number, clientY: number): Position => {
    const board = boardRef.current;
    if (!board) return { x: clientX, y: clientY };
    return {
      x: clamp(clientX - board.left, board.width),
      y: clamp(clientY - board.top, board.height),
    };
  };

  // The threshold gate means the gesture only starts once the pointer travels
  // past CREATE_DRAG_THRESHOLD, so a plain click never fires these handlers and
  // never re-renders the board. By the time onDragEnd runs the drag has already
  // cleared the threshold, so every release draws a real note.
  const { isDragging, startDrag } = usePointerDrag(
    {
      onDragStart: (origin) => {
        boardRef.current = getBoardRect();
        originRef.current = toBoardPoint(origin.x, origin.y);
        setPreviewRect({ ...originRef.current, width: 0, height: 0 });
      },
      onDragMove: (_delta, current) => {
        const point = toBoardPoint(current.x, current.y);
        setPreviewRect(normalizeRect(originRef.current, point));
      },
      onDragEnd: (_delta, current) => {
        const point = toBoardPoint(current.x, current.y);
        const drawn = normalizeRect(originRef.current, point);
        setPreviewRect(null);
        onCreate(drawn);
      },
    },
    CREATE_DRAG_THRESHOLD,
  );

  return { isCreating: isDragging, previewRect, startCreate: startDrag };
}
