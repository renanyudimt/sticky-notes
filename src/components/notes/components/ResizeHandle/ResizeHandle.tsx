import { memo } from "react";

import { RESIZE_HANDLE_LABEL } from "./constants";
import { Handle } from "./styles";
import type { ResizeHandleProps } from "./types";

function ResizeHandleBase({ direction, onResizeStart }: ResizeHandleProps) {
  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
    onResizeStart(direction, event);
  };

  return (
    <Handle
      role="button"
      tabIndex={-1}
      aria-label={RESIZE_HANDLE_LABEL[direction]}
      data-testid={`resize-handle-${direction}`}
      data-resize-handle
      onPointerDown={handlePointerDown}
      $direction={direction}
    />
  );
}

export const ResizeHandle = memo(ResizeHandleBase);
