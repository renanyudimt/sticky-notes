import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Note } from "@/components/notes";
import { createMockRestRepository } from "./mockRestRepository";

const note: Note = {
  id: "n1",
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  text: "",
  color: "blue",
  zIndex: 1,
  createdAt: 0,
  updatedAt: 0,
};

const createMemoryStorage = (): Storage => {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => Array.from(map.keys())[i] ?? null,
    removeItem: (k) => map.delete(k),
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
};

describe("createMockRestRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should await the simulated latency on load", async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const repo = createMockRestRepository({
      storage: createMemoryStorage(),
      latency: 280,
      delay,
    });

    await repo.load();

    expect(delay).toHaveBeenCalledWith(280);
  });

  it("should persist and reload notes asynchronously", async () => {
    const storage = createMemoryStorage();
    const delay = vi.fn().mockResolvedValue(undefined);
    const repo = createMockRestRepository({ storage, delay });

    await repo.save([note]);

    await expect(repo.load()).resolves.toEqual([note]);
  });

  it("should await latency on save too", async () => {
    const delay = vi.fn().mockResolvedValue(undefined);
    const repo = createMockRestRepository({
      storage: createMemoryStorage(),
      delay,
    });

    await repo.save([note]);

    expect(delay).toHaveBeenCalledTimes(1);
  });
});
