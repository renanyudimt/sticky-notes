import { render, screen } from "@/test/renderWithTheme";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NoteCardHeader } from "./NoteCardHeader";

// Stub the color picker (a dependency) with a render spy: each time NoteCardHeader
// renders it re-invokes this stub, so the spy's call count tracks the header's
// renders — a reliable bail check that an outer <Profiler> can't give (it commits
// even when a memoized child bails). The real picker is covered in its own test.
const { colorPickerSpy } = vi.hoisted(() => ({ colorPickerSpy: vi.fn() }));
vi.mock("../NoteColorPicker", () => ({
  NoteColorPicker: ({
    onChange,
  }: {
    value: string;
    onChange: (color: string) => void;
  }) => {
    colorPickerSpy();
    return (
      <button type="button" onClick={() => onChange("pink")}>
        pick color
      </button>
    );
  },
}));

const createProps = () => ({
  color: "yellow" as const,
  onColorChange: vi.fn(),
  onDelete: vi.fn(),
  onPointerDown: vi.fn(),
});

describe("NoteCardHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should emit delete only after the deletion is confirmed", async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<NoteCardHeader {...props} />);

    await user.click(screen.getByRole("button", { name: "Delete note" }));
    expect(props.onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(props.onDelete).toHaveBeenCalledTimes(1);
  });

  it("should emit a color change from the picker", async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<NoteCardHeader {...props} />);

    await user.click(screen.getByRole("button", { name: "pick color" }));

    expect(props.onColorChange).toHaveBeenCalledWith("pink");
  });

  it("should start a drag from the header", async () => {
    const props = createProps();
    const user = userEvent.setup();
    render(<NoteCardHeader {...props} />);

    await user.pointer({
      target: screen.getByRole("banner"),
      keys: "[MouseLeft>]",
    });

    expect(props.onPointerDown).toHaveBeenCalled();
  });

  // The drag win: NoteCard re-renders every frame as the position patches, but
  // the header's props stay referentially stable, so memo must keep it from
  // re-rendering along with it.
  it("should not re-render when its props are unchanged", () => {
    const props = createProps();

    const { rerender } = render(<NoteCardHeader {...props} />);
    expect(colorPickerSpy).toHaveBeenCalledTimes(1);

    colorPickerSpy.mockClear();
    rerender(<NoteCardHeader {...props} />);

    expect(colorPickerSpy).not.toHaveBeenCalled();
  });
});
