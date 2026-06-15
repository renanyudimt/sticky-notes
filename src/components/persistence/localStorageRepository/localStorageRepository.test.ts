import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Note } from "@/components/notes";
import { createLocalStorageRepository } from "./localStorageRepository";

const note: Note = {
  id: "n1",
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  text: "",
  color: "yellow",
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

describe("createLocalStorageRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return an empty list when nothing is stored", async () => {
    const repo = createLocalStorageRepository({
      storage: createMemoryStorage(),
    });
    await expect(repo.load()).resolves.toEqual([]);
  });

  it("should persist and reload notes round-trip", async () => {
    const storage = createMemoryStorage();
    const repo = createLocalStorageRepository({ storage });

    await repo.save([note]);

    await expect(repo.load()).resolves.toEqual([note]);
  });

  it("should write to the provided key", async () => {
    const storage = createMemoryStorage();
    const repo = createLocalStorageRepository({ storage, key: "custom-key" });

    await repo.save([note]);

    expect(storage.getItem("custom-key")).not.toBeNull();
  });
});
