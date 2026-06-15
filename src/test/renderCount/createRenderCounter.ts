import type { ProfilerOnRenderCallback } from "react";

export interface RenderCounter {
  /** Pass to a <Profiler onRender>; tallies one commit per call. */
  onRender: ProfilerOnRenderCallback;
  /** How many times the tree under the given Profiler id has committed. */
  count: (id: string) => number;
  /** Clear all tallies (e.g. between an action and its assertion). */
  reset: () => void;
}

/**
 * Test-only render counter backed by React's <Profiler> onRender callback.
 * Use it to assert render *counts* as a regression guard — e.g. "this action
 * commits exactly once" or "a sibling does not re-render".
 */
export function createRenderCounter(): RenderCounter {
  const counts = new Map<string, number>();

  const onRender: ProfilerOnRenderCallback = (id) => {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  };

  return {
    onRender,
    count: (id) => counts.get(id) ?? 0,
    reset: () => counts.clear(),
  };
}
