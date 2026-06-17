import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { usePopoverPosition } from "../hooks";
import { usePopoverContext } from "./context";
import { Content } from "./styles";
import type { PopoverContentProps } from "./types";

function PopoverContent({
  align = "center",
  sideOffset = 4,
  style,
  ...props
}: PopoverContentProps) {
  const { open, setOpen, triggerRef } = usePopoverContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const position = usePopoverPosition({
    triggerRef,
    contentRef,
    open,
    align,
    sideOffset,
  });

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return createPortal(
    <Content
      ref={contentRef}
      style={{ top: position.top, left: position.left, ...style }}
      {...props}
    />,
    document.body,
  );
}

export { PopoverContent };
