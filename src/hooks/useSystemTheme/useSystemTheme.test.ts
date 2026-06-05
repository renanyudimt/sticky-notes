import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should add the dark class when the OS prefers dark', () => {
    mockMatchMedia(true);
    renderHook(() => useSystemTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should not add the dark class when the OS prefers light', () => {
    mockMatchMedia(false);
    renderHook(() => useSystemTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should not throw when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(() => renderHook(() => useSystemTheme())).not.toThrow();
  });
});
