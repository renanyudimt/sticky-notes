import { useSyncExternalStore } from "react";

import { getActivityState, subscribeActivity } from "./activityStore";
import type { NoteActivity } from "./types";

/**
 * The single-note API write currently in flight, or null when idle. When several
 * actions overlap, precedence is create → delete → edit so the header shows one
 * stable label. Local mutations never touch the store, so this is naturally
 * api-only.
 */
export function useNotesActivity(): NoteActivity | null {
  return useSyncExternalStore(subscribeActivity, () => {
    const state = getActivityState();
    if (state.creating > 0) return "creating";
    if (state.deleting > 0) return "deleting";
    if (state.editing > 0) return "editing";
    return null;
  });
}
