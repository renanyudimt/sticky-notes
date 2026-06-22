import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { act, render, screen } from "@/test/renderWithTheme";

import { addToast, resetToasts } from "../toastStore";
import { Toaster } from "./Toaster";

describe("Toaster", () => {
  beforeEach(() => {
    resetToasts();
  });

  afterEach(() => {
    resetToasts();
  });

  it("should render nothing when there are no toasts", () => {
    render(<Toaster />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("should render an added toast message", () => {
    render(<Toaster />);

    act(() => addToast("success", "Note created", 0));

    expect(screen.getByText("Note created")).toBeInTheDocument();
  });

  it("should remove a toast when its dismiss button is clicked", async () => {
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => addToast("error", "Something failed", 0));

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByText("Something failed")).not.toBeInTheDocument();
  });
});
