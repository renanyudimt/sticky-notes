import { useCallback, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

import type { PopoverAlign } from "../../components/types";

interface UsePopoverPositionOptions {
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  open: boolean;
  align: PopoverAlign;
  sideOffset: number;
}

export interface PopoverPosition {
  top: number;
  left: number;
}

/**
 * Computes a fixed position for popover content anchored below its trigger,
 * honouring `align` and `sideOffset`, recalculating on scroll/resize.
 */
export function usePopoverPosition({
  triggerRef,
  contentRef,
  open,
  align,
  sideOffset,
}: UsePopoverPositionOptions): PopoverPosition {
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0 });

  const update = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const contentWidth = contentRef.current?.offsetWidth ?? 0;

    let left = rect.left;
    if (align === "center") {
      left = rect.left + rect.width / 2 - contentWidth / 2;
    } else if (align === "end") {
      left = rect.right - contentWidth;
    }

    setPosition({ top: rect.bottom + sideOffset, left });
  }, [triggerRef, contentRef, align, sideOffset]);

  useLayoutEffect(() => {
    if (!open) return;

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, update]);

  return position;
}
