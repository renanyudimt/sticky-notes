import { useSyncExternalStore } from "react";

import { getToasts, subscribeToasts } from "./toastStore";
import type { Toast } from "./types";

export function useToasts(): readonly Toast[] {
  return useSyncExternalStore(subscribeToasts, getToasts, getToasts);
}
