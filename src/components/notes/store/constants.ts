export const PERSIST_DEBOUNCE = 400;

/**
 * Floor for how long the `loading` state stays on screen while switching to an
 * async backend. The mock latency alone (~280ms) flashes by too fast to read, so
 * the overlay is held at least this long even if the "backend" resolves sooner.
 */
export const MIN_LOADING_MS = 600;
