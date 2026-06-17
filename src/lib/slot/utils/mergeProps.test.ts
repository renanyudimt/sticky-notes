import { beforeEach, describe, expect, it, vi } from "vitest";

import { mergeProps } from "./mergeProps";

describe("mergeProps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should concatenate class names from slot and child", () => {
    const result = mergeProps(
      { className: "from-slot" },
      { className: "from-child" },
    );

    expect(result.className).toBe("from-slot from-child");
  });

  it("should compose event handlers calling child then slot", () => {
    const calls: string[] = [];
    const slotClick = () => calls.push("slot");
    const childClick = () => calls.push("child");

    const result = mergeProps({ onClick: slotClick }, { onClick: childClick });
    (result.onClick as () => void)();

    expect(calls).toEqual(["child", "slot"]);
  });

  it("should merge style objects with child taking precedence", () => {
    const result = mergeProps(
      { style: { color: "red", margin: 0 } },
      { style: { color: "blue" } },
    );

    expect(result.style).toEqual({ color: "blue", margin: 0 });
  });

  it("should let child props override non-special slot props", () => {
    const result = mergeProps({ id: "slot" }, { id: "child" });

    expect(result.id).toBe("child");
  });
});
