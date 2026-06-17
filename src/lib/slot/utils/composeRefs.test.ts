import { beforeEach, describe, expect, it, vi } from "vitest";

import { composeRefs } from "./composeRefs";

describe("composeRefs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call function refs with the node", () => {
    const refA = vi.fn();
    const refB = vi.fn();
    const node = {} as HTMLElement;

    composeRefs<HTMLElement>(refA, refB)(node);

    expect(refA).toHaveBeenCalledWith(node);
    expect(refB).toHaveBeenCalledWith(node);
  });

  it("should assign the node to object refs", () => {
    const ref = { current: null as HTMLElement | null };
    const node = {} as HTMLElement;

    composeRefs<HTMLElement>(ref)(node);

    expect(ref.current).toBe(node);
  });

  it("should ignore undefined refs", () => {
    const ref = vi.fn();
    const node = {} as HTMLElement;

    expect(() => composeRefs<HTMLElement>(undefined, ref)(node)).not.toThrow();
    expect(ref).toHaveBeenCalledWith(node);
  });
});
