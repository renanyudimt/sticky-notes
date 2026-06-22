import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DATA_SOURCE_STORAGE_KEY,
  DEFAULT_DATA_SOURCE,
  type DataSource,
} from "@/services/notes";

export interface DataSourceState {
  dataSource: DataSource;
  setDataSource: (dataSource: DataSource) => void;
}

const partialize = (state: DataSourceState) => ({
  dataSource: state.dataSource,
});

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
