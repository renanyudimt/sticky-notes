import { DEFAULT_DATA_SOURCE } from "@/services/notes";

import { dataSourceStore } from "../dataSourceStore";

export function resetDataSourceStore(): void {
  dataSourceStore.setState({ dataSource: DEFAULT_DATA_SOURCE });
  dataSourceStore.persist.clearStorage();
}
