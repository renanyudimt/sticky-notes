import type { ResizeDirection } from "../../types";

export interface ResizeHandleProps {
  direction: ResizeDirection;
  onResizeStart: (
    direction: ResizeDirection,
    event: React.PointerEvent,
  ) => void;
}
