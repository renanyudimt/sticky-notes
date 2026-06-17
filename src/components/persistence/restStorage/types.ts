export interface RestStorageOptions {
  /** Backing key-value store the fake backend reads/writes (default: localStorage). */
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  /** Simulated round-trip latency in ms. */
  latency?: number;
  /** Injectable delay (tests pass a controllable one). */
  delay?: (ms: number) => Promise<void>;
}
