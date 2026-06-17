import type * as React from "react";

export interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

export type DialogOverlayProps = React.ComponentProps<"div">;
export type DialogContentProps = React.ComponentProps<"div">;
export type DialogHeaderProps = React.ComponentProps<"div">;
export type DialogFooterProps = React.ComponentProps<"div">;
export type DialogTitleProps = React.ComponentProps<"h2">;
export type DialogDescriptionProps = React.ComponentProps<"p">;
