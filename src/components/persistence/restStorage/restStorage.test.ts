import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRestStorage } from "./restStorage";

const createMemoryStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => map.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      map.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      map.delete(key);
    }),
  };
};

describe("createRestStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should wait out the latency before reading", async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const storage = createMemoryStorage();
    storage.setItem("k", "value");
    const rest = createRestStorage({ storage, latency: 280, delay });

    const result = await rest.getItem("k");

    expect(delay).toHaveBeenCalledWith(280);
    expect(result).toBe("value");
  });

  it("should write through to the backing store after the latency", async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const storage = createMemoryStorage();
    const rest = createRestStorage({ storage, delay });

    await rest.setItem("k", "payload");

    expect(storage.setItem).toHaveBeenCalledWith("k", "payload");
  });

  it("should remove through to the backing store", async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const storage = createMemoryStorage();
    storage.setItem("k", "value");
    const rest = createRestStorage({ storage, delay });

    await rest.removeItem("k");

    expect(storage.removeItem).toHaveBeenCalledWith("k");
  });
});
