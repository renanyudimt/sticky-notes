import { useShallow } from "zustand/react/shallow";

import { dataSourceStore } from "../store/dataSourceStore";
import type { DataSourceContextValue } from "./types";

/**
 * Read (and set) the active data source. Backed by the persisted
 * `dataSourceStore` — no provider required. `useShallow` keeps the returned
 * object stable so consumers only re-render when the selection actually changes.
 */
export function useDataSource(): DataSourceContextValue {
  return dataSourceStore(
    useShallow((state) => ({
      dataSource: state.dataSource,
      setDataSource: state.setDataSource,
    })),
  );
}
