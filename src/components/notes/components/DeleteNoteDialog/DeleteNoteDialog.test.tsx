import { render, screen } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DeleteNoteDialog } from "./DeleteNoteDialog";

describe("DeleteNoteDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not confirm until the dialog is opened and accepted", () => {
    const onConfirm = vi.fn();
    render(<DeleteNoteDialog onConfirm={onConfirm} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should open the confirmation dialog when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteNoteDialog onConfirm={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Delete note" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete note?" }),
    ).toBeInTheDocument();
  });

  it("should confirm deletion when the delete action is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DeleteNoteDialog onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete note" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should close without confirming when cancelled", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DeleteNoteDialog onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Delete note" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
