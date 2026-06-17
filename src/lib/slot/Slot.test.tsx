import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Slot } from "./Slot";

describe("Slot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render its child element", () => {
    render(
      <Slot>
        <a href="/home">Home</a>
      </Slot>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("should merge class names from slot and child", () => {
    render(
      <Slot className="from-slot">
        <a href="/home" className="from-child">
          Home
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveClass("from-slot");
    expect(link).toHaveClass("from-child");
  });

  it("should compose event handlers from slot and child", async () => {
    const user = userEvent.setup();
    const slotClick = vi.fn();
    const childClick = vi.fn();

    render(
      <Slot onClick={slotClick}>
        <button type="button" onClick={childClick}>
          Click
        </button>
      </Slot>,
    );

    await user.click(screen.getByRole("button", { name: "Click" }));

    expect(childClick).toHaveBeenCalledTimes(1);
    expect(slotClick).toHaveBeenCalledTimes(1);
  });

  it("should render nothing when the child is not a valid element", () => {
    const { container } = render(<Slot>plain text</Slot>);
    expect(container).toBeEmptyDOMElement();
  });
});
