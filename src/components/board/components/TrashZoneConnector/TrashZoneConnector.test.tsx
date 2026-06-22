import { act, render, screen } from "@/test/renderWithTheme";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { resetDragState, setDragging, setOverTrash } from "@/components/notes";

import { TrashZoneConnector } from "./TrashZoneConnector";

describe("TrashZoneConnector", () => {
  beforeEach(() => {
    resetDragState();
  });

  afterEach(() => {
    resetDragState();
  });

  it("should render an idle trash zone by default", () => {
    render(<TrashZoneConnector />);
    expect(screen.getByTestId("trash-zone")).toHaveAttribute(
      "aria-current",
      "false",
    );
  });

  it("should become active when a note is dragged over the trash", () => {
    render(<TrashZoneConnector />);

    act(() => {
      setDragging("note-1");
      setOverTrash(true);
    });

    expect(screen.getByTestId("trash-zone")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
