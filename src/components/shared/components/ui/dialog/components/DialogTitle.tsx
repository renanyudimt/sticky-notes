import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/cn";

import type { DialogTitleProps } from "./types";

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

export { DialogTitle };
