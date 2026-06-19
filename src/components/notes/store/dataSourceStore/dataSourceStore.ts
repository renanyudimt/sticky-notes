import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DATA_SOURCE_STORAGE_KEY, DEFAULT_DATA_SOURCE } from "@/services/notes";

import type { DataSourceState } from "./types";

// Only the selection is persisted — the setter is recreated on each load.
const partialize = (state: DataSourceState) => ({
  dataSource: state.dataSource,
});

/**
 * Which backend the notes hooks read from, persisted to `localStorage`.
 * Replaces the old `DataSourceProvider` context: a module singleton so any hook
 * can read it without a provider, with `persist` keeping the user's choice
 * across reloads. `createJSONStorage(localStorage)` is synchronous, so it
 * hydrates eagerly at import.
 */
export const dataSourceStore = create<DataSourceState>()(
  persist(
    (set) => ({
      dataSource: DEFAULT_DATA_SOURCE,
      setDataSource: (dataSource) => set({ dataSource }),
    }),
    {
      name: DATA_SOURCE_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      partialize,
    },
  ),
);
