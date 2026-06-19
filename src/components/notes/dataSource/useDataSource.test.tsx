import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { resetDataSourceStore } from "../store";
import { useDataSource } from "./useDataSource";

describe("useDataSource", () => {
  afterEach(() => {
    resetDataSourceStore();
  });

  it("should default to the local backend", () => {
    const { result } = renderHook(() => useDataSource());

    expect(result.current.dataSource).toBe("local");
  });

  it("should update the active dataSource via setDataSource", () => {
    const { result } = renderHook(() => useDataSource());

    act(() => result.current.setDataSource("api"));

    expect(result.current.dataSource).toBe("api");
  });
});
