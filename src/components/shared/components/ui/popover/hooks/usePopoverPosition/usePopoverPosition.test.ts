import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePopoverPosition } from "./usePopoverPosition";

function buildRefs(contentWidth: number) {
  const trigger = document.createElement("button");
  trigger.getBoundingClientRect = vi.fn(
    () =>
      ({
        left: 100,
        right: 140,
        width: 40,
        bottom: 200,
        top: 184,
        height: 16,
        x: 100,
        y: 184,
        toJSON: () => ({}),
      }) as DOMRect,
  );

  const content = document.createElement("div");
  Object.defineProperty(content, "offsetWidth", { value: contentWidth });

  return {
    triggerRef: { current: trigger },
    contentRef: { current: content },
  };
}

describe("usePopoverPosition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should align the content start edge with the trigger left", () => {
    const { triggerRef, contentRef } = buildRefs(200);
    const { result } = renderHook(() =>
      usePopoverPosition({
        triggerRef,
        contentRef,
        open: true,
        align: "start",
        sideOffset: 4,
      }),
    );

    expect(result.current).toEqual({ top: 204, left: 100 });
  });

  it("should align the content end edge with the trigger right", () => {
    const { triggerRef, contentRef } = buildRefs(200);
    const { result } = renderHook(() =>
      usePopoverPosition({
        triggerRef,
        contentRef,
        open: true,
        align: "end",
        sideOffset: 4,
      }),
    );

    expect(result.current).toEqual({ top: 204, left: -60 });
  });

  it("should keep the default position while closed", () => {
    const { triggerRef, contentRef } = buildRefs(200);
    const { result } = renderHook(() =>
      usePopoverPosition({
        triggerRef,
        contentRef,
        open: false,
        align: "start",
        sideOffset: 4,
      }),
    );

    expect(result.current).toEqual({ top: 0, left: 0 });
  });
});
