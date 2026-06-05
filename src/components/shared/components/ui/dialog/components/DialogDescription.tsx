import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/cn";

import type { DialogDescriptionProps } from "./types";

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export { DialogDescription };
