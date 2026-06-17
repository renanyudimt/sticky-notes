import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSystemTheme } from './useSystemTheme';

const mockMatchMedia = (matches: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    addEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) =>
      listeners.add(cb),
    removeEventListener: (_: string, cb: (event: MediaQueryListEvent) => void) =>
      listeners.delete(cb),
  };
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
  return { mql, listeners };
};

describe('useSystemTheme', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return dark when the OS prefers dark', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe('dark');
  });

  it('should return light when the OS prefers light', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useSystemTheme());
    expect(result.current).toBe('light');
  });

  it('should update the mode when the OS preference changes', () => {
    const { listeners } = mockMatchMedia(false);
    const { result } = renderHook(() => useSystemTheme());

    act(() => {
      listeners.forEach((cb) =>
        cb({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(result.current).toBe('dark');
  });

  it('should not throw when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(() => renderHook(() => useSystemTheme())).not.toThrow();
  });
});
