import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useFocusTrap } from "./useFocusTrap";

function buildContainer() {
  const container = document.createElement("div");
  container.tabIndex = -1;
  const first = document.createElement("button");
  first.textContent = "first";
  const last = document.createElement("button");
  last.textContent = "last";
  container.append(first, last);
  document.body.append(container);
  return { container, first, last };
}

describe("useFocusTrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should focus the first focusable element when activated", () => {
    const { container, first } = buildContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    expect(document.activeElement).toBe(first);
  });

  it("should not move focus when inactive", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();
    const { container } = buildContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false));

    expect(document.activeElement).toBe(outside);
  });

  it("should wrap focus to the first element when tabbing past the last", () => {
    const { container, first, last } = buildContainer();
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    last.focus();
    container.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );

    expect(document.activeElement).toBe(first);
  });
});
