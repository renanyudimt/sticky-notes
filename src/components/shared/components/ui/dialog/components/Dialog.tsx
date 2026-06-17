import { useCallback, useMemo, useState } from "react";

import { DialogContext } from "./context";
import type { DialogProps } from "./types";

function Dialog({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export { Dialog };
