import { render, screen } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ClearAllDialog } from "./ClearAllDialog";

describe("ClearAllDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not confirm until the dialog is opened and accepted", () => {
    const onConfirm = vi.fn();
    render(<ClearAllDialog onConfirm={onConfirm} disabled={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should open the confirmation dialog when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<ClearAllDialog onConfirm={vi.fn()} disabled={false} />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Clear all notes?" }),
    ).toBeInTheDocument();
  });

  it("should confirm clearing when the confirm action is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ClearAllDialog onConfirm={onConfirm} disabled={false} />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    await user.click(screen.getByRole("button", { name: "Delete all" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should close without confirming when cancelled", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<ClearAllDialog onConfirm={onConfirm} disabled={false} />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should not open the dialog when disabled", async () => {
    // pointerEventsCheck off so we can attempt the click on the disabled
    // (pointer-events: none) trigger and assert it stays closed.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<ClearAllDialog onConfirm={vi.fn()} disabled />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
