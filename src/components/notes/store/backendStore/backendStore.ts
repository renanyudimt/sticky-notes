import { create } from "zustand";

import type { RepositoryKind } from "@/components/persistence";

interface BackendState {
  /** Which backend store is currently active (drives the selector hooks). */
  kind: RepositoryKind;
  setKind: (kind: RepositoryKind) => void;
}

/**
 * Tracks which backend is active. Kept separate from the notes stores because it
 * is *about* them — it decides which one the hooks read from — and must not live
 * inside either.
 */
export const useBackendStore = create<BackendState>((set) => ({
  kind: "local",
  setKind: (kind) => set({ kind }),
}));
