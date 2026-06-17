import { Slot } from "@/lib/slot";

import { useDialogContext } from "./context";
import type { DialogTriggerProps } from "./types";

function DialogTrigger({
  asChild = false,
  onClick,
  ...props
}: DialogTriggerProps) {
  const { open, setOpen } = useDialogContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setOpen(true);
  };

  const triggerProps = {
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

export { DialogTrigger };
