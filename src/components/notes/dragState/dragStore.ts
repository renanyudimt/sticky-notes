import type { DragState } from "./types";

/**
 * A tiny external store for the *ephemeral* drag state (which note is being
 * dragged and whether it's over the trash). This is pure UI state, not server
 * data, so it stays out of React Query. Kept as a selector store (not context)
 * so a card crossing the trash re-renders only that card and the trash zone —
 * never the whole board. Mirrors the granularity the old Zustand store gave.
 */

let state: DragState = { draggingId: null, isOverTrash: false };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeDrag(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDragState(): DragState {
  return state;
}

export function setDragging(id: string | null): void {
  if (state.draggingId === id) return;
  state = { ...state, draggingId: id };
  emit();
}

export function setOverTrash(isOverTrash: boolean): void {
  if (state.isOverTrash === isOverTrash) return;
  state = { ...state, isOverTrash };
  emit();
}

/** Reset to the idle state — used on drag end and in test teardown. */
export function resetDragState(): void {
  if (state.draggingId === null && !state.isOverTrash) return;
  state = { draggingId: null, isOverTrash: false };
  emit();
}
