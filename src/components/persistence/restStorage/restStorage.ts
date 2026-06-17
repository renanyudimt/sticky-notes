import type { StateStorage } from "zustand/middleware";

import { delay as defaultDelay } from "@/components/shared";

import { MOCK_REST_LATENCY } from "../constants";

import type { RestStorageOptions } from "./types";

/**
 * A `StateStorage` that mimics a REST backend: every read/write waits out a
 * latency before touching the underlying store. Plugged into Zustand's `persist`
 * so hydrating the rest store "calls the backend" instead of reading synchronously.
 */
export function createRestStorage(
  options: RestStorageOptions = {},
): StateStorage {
  const storage = options.storage ?? window.localStorage;
  const latency = options.latency ?? MOCK_REST_LATENCY;
  const delay = options.delay ?? defaultDelay;

  return {
    async getItem(name) {
      await delay(latency);
      return storage.getItem(name);
    },
    async setItem(name, value) {
      await delay(latency);
      storage.setItem(name, value);
    },
    async removeItem(name) {
      await delay(latency);
      storage.removeItem(name);
    },
  };
}
