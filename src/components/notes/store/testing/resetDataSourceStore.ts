import { DEFAULT_DATA_SOURCE } from "@/services/notes";

import { dataSourceStore } from "../dataSourceStore";

/**
 * Reset the active backend to the default and drop the persisted entry. Use in
 * test teardown — the store is a module singleton, so the selection would
 * otherwise leak between tests.
 */
export function resetDataSourceStore(): void {
  dataSourceStore.setState({ dataSource: DEFAULT_DATA_SOURCE });
  void dataSourceStore.persist.clearStorage();
}
