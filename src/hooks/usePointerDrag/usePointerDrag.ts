import { useCallback, useEffect, useRef, useState } from "react";

import type {
  DragPoint,
  PointerDragHandlers,
  UsePointerDragResult,
} from "./types";

export function usePointerDrag(
  handlers: PointerDragHandlers,
): UsePointerDragResult {
  const [isDragging, setIsDragging] = useState(false);

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const originRef = useRef<DragPoint>({ x: 0, y: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  const startDrag = useCallback((event: React.PointerEvent) => {
    if (event.button !== 0) return;

    const origin: DragPoint = { x: event.clientX, y: event.clientY };
    originRef.current = origin;
    setIsDragging(true);
    handlersRef.current.onDragStart?.(origin, event.nativeEvent);

    const handleMove = (moveEvent: PointerEvent) => {
      const current: DragPoint = {
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      };
      handlersRef.current.onDragMove?.(
        { dx: current.x - origin.x, dy: current.y - origin.y },
        current,
        moveEvent,
      );
    };

    const handleEnd = (endEvent: PointerEvent) => {
      const current: DragPoint = { x: endEvent.clientX, y: endEvent.clientY };
      handlersRef.current.onDragEnd?.(
        { dx: current.x - origin.x, dy: current.y - origin.y },
        current,
        endEvent,
      );
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
      cleanupRef.current = null;
      setIsDragging(false);
    };

    cleanupRef.current = cleanup;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { isDragging, startDrag };
}
