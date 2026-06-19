import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { addToast, resetToasts } from "./toastStore";
import { useToasts } from "./useToasts";

describe("useToasts", () => {
  beforeEach(() => {
    resetToasts();
  });

  afterEach(() => {
    resetToasts();
  });

  it("should start empty", () => {
    const { result } = renderHook(() => useToasts());

    expect(result.current).toEqual([]);
  });

  it("should re-render with the new toast when one is added", () => {
    const { result } = renderHook(() => useToasts());

    act(() => {
      addToast("success", "Saved", 0);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toMatchObject({ type: "success", message: "Saved" });
  });
});
