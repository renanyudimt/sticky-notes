import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getToasts,
  resetToasts,
} from "@/components/shared/components/ui/toast/toastStore";

import { createQueryClient } from "./queryClient";

describe("createQueryClient", () => {
  beforeEach(() => {
    resetToasts();
  });

  afterEach(() => {
    resetToasts();
  });

  it("should fire an error toast when a mutation fails", async () => {
    const client = createQueryClient();
    const mutation = client.getMutationCache().build(client, {
      mutationFn: () => Promise.reject(new Error("nope")),
    });

    await mutation.execute(undefined).catch(() => undefined);

    expect(
      getToasts().some(
        (toast) => toast.type === "error" && toast.message === "nope",
      ),
    ).toBe(true);
  });

  it("should not retry failed queries by default", () => {
    const client = createQueryClient();

    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });
});
