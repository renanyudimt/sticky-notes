import type { StateStorage } from "zustand/middleware";

import { debounce } from "@/components/shared";

export interface DebouncedStateStorage extends StateStorage {
  /** Drop a pending write (used on reset/teardown so it can't resurrect data). */
  cancel: () => void;
}

/**
 * Wraps a `StateStorage` so writes are debounced — `persist` calls `setItem` on
 * every state change (every drag frame), and this collapses that into one write
 * per quiet window. Reads pass straight through; `removeItem` cancels any pending
 * write first so a delete can't be undone by a late flush.
 */
export function createDebouncedStorage(
  base: StateStorage,
  wait: number,
): DebouncedStateStorage {
  const flush = debounce((name: string, value: string) => {
    void base.setItem(name, value);
  }, wait);

  return {
    getItem: (name) => base.getItem(name),
    setItem: (name, value) => flush(name, value),
    removeItem: (name) => {
      flush.cancel();
      return base.removeItem(name);
    },
    cancel: () => flush.cancel(),
  };
}
