import { memo } from "react";

import { cn } from "@/components/shared";

import { RESIZE_HANDLE_LABEL } from "./constants";
import { HANDLE_BASE, HANDLE_CURSOR, HANDLE_POSITION } from "./styles";
import type { ResizeHandleProps } from "./types";

function ResizeHandleBase({ direction, onResizeStart }: ResizeHandleProps) {
  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
    onResizeStart(direction, event);
  };

  return (
    <div
      role="button"
      tabIndex={-1}
      aria-label={RESIZE_HANDLE_LABEL[direction]}
      data-testid={`resize-handle-${direction}`}
      onPointerDown={handlePointerDown}
      className={cn(
        HANDLE_BASE,
        HANDLE_POSITION[direction],
        HANDLE_CURSOR[direction],
      )}
    />
  );
}

// Memoized so editing a note's text (which re-renders NoteCard via the patched
// `note`) does not re-render the four static handles. Props are stable:
// `direction` is constant and `onResizeStart` is memoized in NoteCard.
export const ResizeHandle = memo(ResizeHandleBase);
