/** Absolute pointer coordinates (viewport space). */
export interface DragPoint {
  x: number;
  y: number;
}

/** Movement since the drag started. */
export interface DragDelta {
  dx: number;
  dy: number;
}

export interface PointerDragHandlers {
  /** Fired on pointer down, before any movement. */
  onDragStart?: (origin: DragPoint, event: PointerEvent) => void;
  /** Fired on every pointer move while dragging. */
  onDragMove?: (delta: DragDelta, current: DragPoint, event: PointerEvent) => void;
  /** Fired once on pointer up. */
  onDragEnd?: (delta: DragDelta, current: DragPoint, event: PointerEvent) => void;
}

export interface UsePointerDragResult {
  isDragging: boolean;
  /** Attach to an element's `onPointerDown` to begin a drag gesture. */
  startDrag: (event: React.PointerEvent) => void;
}
