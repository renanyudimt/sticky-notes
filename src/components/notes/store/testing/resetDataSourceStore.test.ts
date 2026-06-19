import { afterEach, describe, expect, it } from "vitest";

import { DATA_SOURCE_STORAGE_KEY } from "@/services/notes";

import { dataSourceStore } from "../dataSourceStore";
import { resetDataSourceStore } from "./resetDataSourceStore";

describe("resetDataSourceStore", () => {
  afterEach(() => {
    dataSourceStore.setState({ dataSource: "local" });
    window.localStorage.clear();
  });

  it("should restore the default backend and clear the persisted entry", () => {
    dataSourceStore.getState().setDataSource("api");

    resetDataSourceStore();

    expect(dataSourceStore.getState().dataSource).toBe("local");
    expect(window.localStorage.getItem(DATA_SOURCE_STORAGE_KEY)).toBeNull();
  });
});
