import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NotesProvider } from "@/components/notes";
import type { NotesRepository } from "@/components/persistence";

import { Board } from "./Board";

const emptyRepository = (): NotesRepository => ({
  load: vi.fn().mockResolvedValue([]),
  save: vi.fn().mockResolvedValue(undefined),
});

const renderBoard = (
  repository: NotesRepository,
  options: { autoHydrate?: boolean } = {},
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NotesProvider
      repository={repository}
      autoHydrate={options.autoHydrate ?? false}
      persistDelay={0}
    >
      {children}
    </NotesProvider>
  );
  return render(<Board />, { wrapper });
};

describe("Board", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show the empty hint when there are no notes", () => {
    renderBoard(emptyRepository());
    expect(
      screen.getByText(/Double-click to create a note/),
    ).toBeInTheDocument();
  });

  it("should render the trash zone", () => {
    renderBoard(emptyRepository());
    expect(screen.getByTestId("trash-zone")).toBeInTheDocument();
  });

  it("should create a note on double-click", async () => {
    renderBoard(emptyRepository());
    const user = userEvent.setup();

    await user.dblClick(screen.getByTestId("board"));

    expect(screen.getByRole("article", { name: "Note" })).toBeInTheDocument();
    expect(screen.getByText("1 note")).toBeInTheDocument();
  });

  it("should not create a note on a single click", async () => {
    renderBoard(emptyRepository());
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId("board"),
      keys: "[MouseLeft]",
    });

    expect(
      screen.queryByRole("article", { name: "Note" }),
    ).not.toBeInTheDocument();
  });

  it("should show a loading state while hydrating", () => {
    const pending: NotesRepository = {
      load: vi.fn().mockReturnValue(new Promise(() => {})),
      save: vi.fn().mockResolvedValue(undefined),
    };
    renderBoard(pending, { autoHydrate: true });

    expect(screen.getByText("Loading notes...")).toBeInTheDocument();
  });
});
