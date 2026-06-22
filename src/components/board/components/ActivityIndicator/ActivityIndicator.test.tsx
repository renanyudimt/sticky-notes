import { render, screen } from "@/test/renderWithTheme";
import { describe, expect, it } from "vitest";

import { BOARD_STRINGS } from "../../constants";
import { ActivityIndicator } from "./ActivityIndicator";

describe("ActivityIndicator", () => {
  it("should render nothing when idle", () => {
    const { container } = render(<ActivityIndicator activity={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("should show the creating label", () => {
    render(<ActivityIndicator activity="creating" />);

    expect(screen.getByRole("status")).toHaveTextContent(
      BOARD_STRINGS.activity.creating,
    );
  });

  it("should show the editing label", () => {
    render(<ActivityIndicator activity="editing" />);

    expect(screen.getByRole("status")).toHaveTextContent(
      BOARD_STRINGS.activity.editing,
    );
  });

  it("should show the deleting label", () => {
    render(<ActivityIndicator activity="deleting" />);

    expect(screen.getByRole("status")).toHaveTextContent(
      BOARD_STRINGS.activity.deleting,
    );
  });
});
