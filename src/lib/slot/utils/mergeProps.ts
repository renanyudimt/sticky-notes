import type { Ref } from "react";

import { CLASS_NAME_PROP, REF_PROP, STYLE_PROP } from "../constants";
import type { AnyProps } from "../types";
import { composeRefs } from "./composeRefs";
import { isEventHandler } from "./isEventHandler";

/** Merges the slot's own props onto the child, composing handlers, refs and class names. */
export function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (isEventHandler(key, slotValue) && isEventHandler(key, childValue)) {
      merged[key] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
    } else if (key === CLASS_NAME_PROP) {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else if (key === STYLE_PROP) {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === REF_PROP) {
      merged[key] = composeRefs(
        slotValue as Ref<unknown>,
        childValue as Ref<unknown>,
      );
    }
  }

  return merged;
}
