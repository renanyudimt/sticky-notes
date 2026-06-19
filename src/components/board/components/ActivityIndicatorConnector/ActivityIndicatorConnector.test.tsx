import { act, render, screen } from "@/test/renderWithTheme";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { beginActivity, endActivity, resetActivityState } from "@/components/notes";

import { BOARD_STRINGS } from "../../constants";
import { ActivityIndicatorConnector } from "./ActivityIndicatorConnector";

describe("ActivityIndicatorConnector", () => {
  beforeEach(() => {
    resetActivityState();
  });

  afterEach(() => {
    resetActivityState();
  });

  it("should render nothing while idle", () => {
    const { container } = render(<ActivityIndicatorConnector />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should show the label while a write is in flight", () => {
    render(<ActivityIndicatorConnector />);

    act(() => {
      beginActivity("creating");
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      BOARD_STRINGS.activity.creating,
    );
  });

  it("should clear the label once the write settles", () => {
    render(<ActivityIndicatorConnector />);

    act(() => {
      beginActivity("deleting");
    });
    act(() => {
      endActivity("deleting");
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
