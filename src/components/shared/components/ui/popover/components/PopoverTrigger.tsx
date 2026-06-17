import { Slot } from "@/lib/slot";

import { usePopoverContext } from "./context";
import type { PopoverTriggerProps } from "./types";

function PopoverTrigger({
  asChild = false,
  onClick,
  ...props
}: PopoverTriggerProps) {
  const { open, toggle, triggerRef } = usePopoverContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    toggle();
  };

  const triggerProps = {
    ref: triggerRef,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": open,
    onClick: handleClick,
    ...props,
  };

  if (asChild) {
    return <Slot {...triggerProps} />;
  }

  return <button type="button" {...triggerProps} />;
}

export { PopoverTrigger };
