import type * as React from "react";

export type PopoverAlign = "start" | "center" | "end";

export interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

export interface PopoverContentProps extends React.ComponentProps<"div"> {
  align?: PopoverAlign;
  sideOffset?: number;
}
