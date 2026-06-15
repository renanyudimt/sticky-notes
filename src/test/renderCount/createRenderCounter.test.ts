import { describe, expect, it } from "vitest";

import { createRenderCounter } from "./createRenderCounter";

describe("createRenderCounter", () => {
  it("should report zero for an unknown id", () => {
    const counter = createRenderCounter();
    expect(counter.count("missing")).toBe(0);
  });

  it("should tally one commit per onRender call", () => {
    const counter = createRenderCounter();

    counter.onRender("note", "mount", 0, 0, 0, 0);
    counter.onRender("note", "update", 0, 0, 0, 0);

    expect(counter.count("note")).toBe(2);
  });

  it("should track ids independently", () => {
    const counter = createRenderCounter();

    counter.onRender("a", "mount", 0, 0, 0, 0);
    counter.onRender("b", "mount", 0, 0, 0, 0);
    counter.onRender("b", "update", 0, 0, 0, 0);

    expect(counter.count("a")).toBe(1);
    expect(counter.count("b")).toBe(2);
  });

  it("should clear all tallies on reset", () => {
    const counter = createRenderCounter();
    counter.onRender("note", "mount", 0, 0, 0, 0);

    counter.reset();

    expect(counter.count("note")).toBe(0);
  });

  it("should keep counting after reset", () => {
    const counter = createRenderCounter();
    counter.onRender("note", "mount", 0, 0, 0, 0);
    counter.reset();

    counter.onRender("note", "update", 0, 0, 0, 0);

    expect(counter.count("note")).toBe(1);
  });
});
