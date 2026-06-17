import { useCallback, useMemo, useRef, useState } from "react";

import { PopoverContext } from "./context";
import type { PopoverProps } from "./types";

function Popover({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const value = useMemo(
    () => ({ open, setOpen, toggle, triggerRef }),
    [open, setOpen, toggle],
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

export { Popover };
