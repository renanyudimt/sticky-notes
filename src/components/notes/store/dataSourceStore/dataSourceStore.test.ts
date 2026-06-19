import { afterEach, describe, expect, it } from "vitest";

import { DATA_SOURCE_STORAGE_KEY, DEFAULT_DATA_SOURCE } from "@/services/notes";

import { dataSourceStore } from "./dataSourceStore";

describe("dataSourceStore", () => {
  afterEach(() => {
    dataSourceStore.setState({ dataSource: DEFAULT_DATA_SOURCE });
    window.localStorage.clear();
  });

  it("should default to the local backend", () => {
    expect(dataSourceStore.getState().dataSource).toBe("local");
  });

  it("should switch the active backend via setDataSource", () => {
    dataSourceStore.getState().setDataSource("api");

    expect(dataSourceStore.getState().dataSource).toBe("api");
  });

  it("should persist the selection to localStorage", () => {
    dataSourceStore.getState().setDataSource("api");

    const persisted = window.localStorage.getItem(DATA_SOURCE_STORAGE_KEY);
    expect(persisted).toContain("api");
  });
});
