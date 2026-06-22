import { useShallow } from "zustand/react/shallow";

import { dataSourceStore, type DataSourceState } from "../dataSourceStore";

export function useDataSource(): DataSourceState {
  return dataSourceStore(
    useShallow((state) => ({
      dataSource: state.dataSource,
      setDataSource: state.setDataSource,
    })),
  );
}
