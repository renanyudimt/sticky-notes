import { beforeEach, describe, expect, it } from "vitest";

import { useBackendStore } from "./backendStore";

describe("useBackendStore", () => {
  beforeEach(() => {
    useBackendStore.setState({ kind: "local" });
  });

  it("should default to the local backend", () => {
    expect(useBackendStore.getState().kind).toBe("local");
  });

  it("should switch the active backend kind", () => {
    useBackendStore.getState().setKind("rest");
    expect(useBackendStore.getState().kind).toBe("rest");
  });
});
