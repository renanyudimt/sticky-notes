import { cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";

import type { AnyProps, SlotProps } from "./types";
import { mergeProps } from "./utils";

export function Slot({ children, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    return null;
  }

  const child = children as ReactElement<AnyProps>;
  return cloneElement(child, mergeProps(slotProps as AnyProps, child.props));
}
