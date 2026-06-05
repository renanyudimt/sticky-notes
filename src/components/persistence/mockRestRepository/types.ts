export interface MockRestRepositoryOptions {
  storage?: Storage;
  key?: string;
  latency?: number;
  delay?: (ms: number) => Promise<void>;
}
