import type { ActivityState, NoteActivity } from "./types";

/**
 * A tiny external store for the *ephemeral* write activity (which API mutation
 * is in flight). This is pure UI state, not server data, so it stays out of
 * React Query — and it deliberately avoids React Query's global mutation
 * registry (`useIsMutating`), mirroring the selector-store pattern the app
 * already uses for drag state. Subscribing here lets the header indicator
 * re-render on its own, never the toolbar or the board.
 *
 * Local mutations are synchronous (Zustand) and never touch this store, so it
 * stays idle in local mode — the activity is naturally API-only.
 */

let state: ActivityState = { creating: 0, editing: 0, deleting: 0 };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeActivity(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getActivityState(): ActivityState {
  return state;
}

/** Marks a write action as in flight (increments its counter). */
export function beginActivity(action: NoteActivity): void {
  state = { ...state, [action]: state[action] + 1 };
  emit();
}

/** Marks a write action as settled (decrements its counter, clamped at zero). */
export function endActivity(action: NoteActivity): void {
  const next = Math.max(0, state[action] - 1);
  if (next === state[action]) return;
  state = { ...state, [action]: next };
  emit();
}

/** Reset back to idle — used in test teardown. */
export function resetActivityState(): void {
  if (state.creating === 0 && state.editing === 0 && state.deleting === 0) return;
  state = { creating: 0, editing: 0, deleting: 0 };
  emit();
}
