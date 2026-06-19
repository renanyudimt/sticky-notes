import { useSyncExternalStore } from "react";

import { getDragState, subscribeDrag } from "./dragStore";

/** True while this specific note is being dragged onto the trash zone. */
export function useNotePendingDelete(id: string): boolean {
  return useSyncExternalStore(subscribeDrag, () => {
    const state = getDragState();
    return state.draggingId === id && state.isOverTrash;
  });
}
