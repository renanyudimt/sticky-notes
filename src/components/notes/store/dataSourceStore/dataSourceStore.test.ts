import { afterEach, describe, expect, it } from "vitest";

import { DATA_SOURCE_STORAGE_KEY } from "@/services/notes";

import { dataSourceStore } from "./dataSourceStore";
import { resetDataSourceStore } from "../testing";

describe("dataSourceStore", () => {
  afterEach(() => {
    resetDataSourceStore();
  });

  it("should default to the local backend", () => {
    expect(dataSourceStore.getState().dataSource).toBe("local");
  });

  it("should update the active dataSource via setDataSource", () => {
    dataSourceStore.getState().setDataSource("api");

    expect(dataSourceStore.getState().dataSource).toBe("api");
  });

  it("should persist the selection to localStorage", () => {
    dataSourceStore.getState().setDataSource("api");

    expect(window.localStorage.getItem(DATA_SOURCE_STORAGE_KEY)).toContain("api");
  });
});
