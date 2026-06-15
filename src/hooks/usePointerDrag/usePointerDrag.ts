import { useCallback, useEffect, useRef, useState } from "react";

import type {
  DragPoint,
  PointerDragHandlers,
  UsePointerDragResult,
} from "./types";

/**
 * Tracks a pointer drag gesture via window listeners.
 *
 * @param threshold Minimum pointer travel (px, per-axis) before the gesture
 *   counts as a drag. Defaults to `0` (starts eagerly on pointer down). When
 *   positive, a click below the threshold never starts — no handlers fire and
 *   `isDragging` never flips, so the consuming component does not re-render.
 */
export function usePointerDrag(
  handlers: PointerDragHandlers,
  threshold = 0,
): UsePointerDragResult {
  const [isDragging, setIsDragging] = useState(false);

  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const thresholdRef = useRef(threshold);
  useEffect(() => {
    thresholdRef.current = threshold;
  });

  const originRef = useRef<DragPoint>({ x: 0, y: 0 });
  const cleanupRef = useRef<(() => void) | null>(null);

  const startDrag = useCallback((event: React.PointerEvent) => {
    if (event.button !== 0) return;

    const origin: DragPoint = { x: event.clientX, y: event.clientY };
    originRef.current = origin;
    const minDistance = thresholdRef.current;

    // With a threshold, the gesture stays dormant until the pointer moves past
    // it — a click (pointer up below the threshold) never starts, so neither
    // `isDragging` nor the consumer's handlers fire and the component does not
    // re-render. With threshold 0 the drag starts eagerly on pointer down.
    let started = false;

    const exceedsThreshold = (current: DragPoint) =>
      Math.abs(current.x - origin.x) >= minDistance ||
      Math.abs(current.y - origin.y) >= minDistance;

    const start = (startEvent: PointerEvent) => {
      started = true;
      setIsDragging(true);
      handlersRef.current.onDragStart?.(origin, startEvent);
    };

    const handleMove = (moveEvent: PointerEvent) => {
      const current: DragPoint = {
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      };
      if (!started) {
        if (!exceedsThreshold(current)) return;
        start(moveEvent);
      }
      handlersRef.current.onDragMove?.(
        { dx: current.x - origin.x, dy: current.y - origin.y },
        current,
        moveEvent,
      );
    };

    const handleEnd = (endEvent: PointerEvent) => {
      const current: DragPoint = { x: endEvent.clientX, y: endEvent.clientY };
      if (!started) {
        // Below threshold and never started → a click: tear down silently.
        if (!exceedsThreshold(current)) {
          cleanup();
          return;
        }
        start(endEvent);
      }
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
      if (started) setIsDragging(false);
    };

    if (minDistance <= 0) start(event.nativeEvent);

    cleanupRef.current = cleanup;
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return { isDragging, startDrag };
}
