import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("a", 500));

    expect(result.current).toBe("a");
  });

  it("should not update before the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(result.current).toBe("a");
  });

  it("should update to the latest value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("b");
  });

  it("should collapse rapid changes into a single trailing update", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(200));

    expect(result.current).toBe("c");
  });
});
