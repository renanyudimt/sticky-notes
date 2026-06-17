import { EVENT_HANDLER_PATTERN } from "../constants";
import type { EventHandler } from "../types";

/** Narrows a prop entry to a React event handler (`onClick`, `onKeyDown`, …). */
export function isEventHandler(
  key: string,
  value: unknown,
): value is EventHandler {
  return EVENT_HANDLER_PATTERN.test(key) && typeof value === "function";
}
