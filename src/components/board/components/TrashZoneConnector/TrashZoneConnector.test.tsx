import { act, render, screen } from "@/test/renderWithTheme";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { notesLocalStore, resetNotesStores } from "@/components/notes";

import { TrashZoneConnector } from "./TrashZoneConnector";

describe("TrashZoneConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStores();
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
      notesLocalStore.getState().setDragging("note-1");
      notesLocalStore.getState().setOverTrash(true);
    });

    expect(screen.getByTestId("trash-zone")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
