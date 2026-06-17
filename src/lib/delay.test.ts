import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { delay } from './delay';

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not resolve before the delay elapses', async () => {
    const settled = vi.fn();
    void delay(200).then(settled);

    await Promise.resolve();
    expect(settled).not.toHaveBeenCalled();
  });

  it('should resolve once the delay elapses', async () => {
    const settled = vi.fn();
    const promise = delay(200).then(settled);

    await vi.advanceTimersByTimeAsync(200);
    await promise;

    expect(settled).toHaveBeenCalledTimes(1);
  });
});
