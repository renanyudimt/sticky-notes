import { act, render, screen } from "@testing-library/react";
import { useEffect, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotesProvider, useNoteActions } from "@/components/notes";
import type { NotesRepository } from "@/components/persistence";

import { TrashZoneConnector } from "./TrashZoneConnector";

const repository: NotesRepository = {
  load: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
};

const actionsRef: { current: ReturnType<typeof useNoteActions> | null } = {
  current: null,
};

function Capture() {
  const actions = useNoteActions();
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);
  return null;
}

const renderInProvider = (ui: ReactNode) =>
  render(
    <NotesProvider repository={repository} autoHydrate={false} persistDelay={0}>
      <Capture />
      {ui}
    </NotesProvider>,
  );

describe("TrashZoneConnector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    actionsRef.current = null;
  });

  it("should render an idle trash zone by default", () => {
    renderInProvider(<TrashZoneConnector />);
    expect(screen.getByTestId("trash-zone")).toHaveAttribute(
      "aria-current",
      "false",
    );
  });

  it("should become active when a note is dragged over the trash", () => {
    renderInProvider(<TrashZoneConnector />);

    act(() => {
      actionsRef.current!.setDragging("note-1");
      actionsRef.current!.setOverTrash(true);
    });

    expect(screen.getByTestId("trash-zone")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});
