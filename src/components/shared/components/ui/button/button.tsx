import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

import { buttonVariants } from "./variants";
import type { ButtonProps } from "./types";

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
