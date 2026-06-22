import { useSyncExternalStore } from "react";

import { getDragState, subscribeDrag } from "../dragStore";

/** True while any note is being dragged onto the trash zone. */
export function useTrashActive(): boolean {
  return useSyncExternalStore(subscribeDrag, () => {
    const state = getDragState();
    return state.draggingId !== null && state.isOverTrash;
  });
}
