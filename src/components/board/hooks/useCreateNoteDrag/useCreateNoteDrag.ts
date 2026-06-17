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
  const previewRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const originRef = useRef<Position>({ x: 0, y: 0 });
  const boardRef = useRef<DOMRect | null>(null);

  // A live drag preview is a ~60fps stream of position updates. Routing it
  // through React state (local or store) would re-render a component on every
  // frame. Instead we paint the rect straight onto the always-mounted preview
  // element via its ref, so the board, the surface and the preview itself stay
  // out of React's render loop during the whole gesture — only `el.style`
  // mutates. `isCreating` is the one piece of real state, flipped once at the
  // start/end purely so the board can hide its empty hint.
  const paint = (rect: Rect | null) => {
    const el = previewRef.current;
    if (!el) return;
    if (!rect) {
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    el.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
  };

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
  const { startDrag } = usePointerDrag(
    {
      onDragStart: (origin) => {
        boardRef.current = getBoardRect();
        originRef.current = toBoardPoint(origin.x, origin.y);
        setIsCreating(true);
        paint({ ...originRef.current, width: 0, height: 0 });
      },
      onDragMove: (_delta, current) => {
        const point = toBoardPoint(current.x, current.y);
        paint(normalizeRect(originRef.current, point));
      },
      onDragEnd: (_delta, current) => {
        const point = toBoardPoint(current.x, current.y);
        const drawn = normalizeRect(originRef.current, point);
        paint(null);
        setIsCreating(false);
        onCreate(drawn);
      },
    },
    CREATE_DRAG_THRESHOLD,
  );

  return { isCreating, previewRef, startCreate: startDrag };
}
