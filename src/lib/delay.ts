/** Resolve after `ms` milliseconds. Used to simulate async latency and to floor
 * how long a transient UI state (e.g. loading) stays on screen. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
