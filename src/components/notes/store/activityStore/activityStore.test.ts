import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  beginActivity,
  endActivity,
  getActivityState,
  resetActivityState,
  subscribeActivity,
} from "./activityStore";

describe("activityStore", () => {
  beforeEach(() => {
    resetActivityState();
  });

  afterEach(() => {
    resetActivityState();
  });

  it("should start idle", () => {
    expect(getActivityState()).toEqual({
      creating: 0,
      editing: 0,
      deleting: 0,
    });
  });

  it("should increment the action counter on begin", () => {
    beginActivity("creating");

    expect(getActivityState().creating).toBe(1);
  });

  it("should track overlapping actions of the same kind", () => {
    beginActivity("editing");
    beginActivity("editing");

    expect(getActivityState().editing).toBe(2);
  });

  it("should decrement back to idle on end", () => {
    beginActivity("deleting");
    endActivity("deleting");

    expect(getActivityState().deleting).toBe(0);
  });

  it("should clamp the counter at zero", () => {
    endActivity("creating");

    expect(getActivityState().creating).toBe(0);
  });

  it("should notify subscribers on change", () => {
    const listener = vi.fn();
    subscribeActivity(listener);

    beginActivity("creating");

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should not notify when an end leaves the counter unchanged", () => {
    const listener = vi.fn();
    subscribeActivity(listener);

    endActivity("editing");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should reset every counter back to idle", () => {
    beginActivity("creating");
    beginActivity("editing");

    resetActivityState();

    expect(getActivityState()).toEqual({
      creating: 0,
      editing: 0,
      deleting: 0,
    });
  });
});
