import { render, screen } from "@/test/renderWithTheme";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createNote,
  notesRestStore,
  resetNotesStores,
  useBackendStore,
} from "@/components/notes";
import { ThemeModeProvider } from "@/theme";

import { Board } from "./Board";

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeModeProvider>{children}</ThemeModeProvider>
);

const renderBoard = () => render(<Board />, { wrapper });

describe("Board", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStores();
  });

  it("should show the empty hint when there are no notes", () => {
    renderBoard();
    expect(
      screen.getByText(/Double-click to create a note/),
    ).toBeInTheDocument();
  });

  it("should render the trash zone", () => {
    renderBoard();
    expect(screen.getByTestId("trash-zone")).toBeInTheDocument();
  });

  it("should create a note on double-click", async () => {
    renderBoard();
    const user = userEvent.setup();

    await user.dblClick(screen.getByTestId("board"));

    expect(screen.getByRole("article", { name: "Note" })).toBeInTheDocument();
    expect(screen.getByText("1 note")).toBeInTheDocument();
  });

  it("should not create a note on a single click", async () => {
    renderBoard();
    const user = userEvent.setup();

    await user.pointer({
      target: screen.getByTestId("board"),
      keys: "[MouseLeft]",
    });

    expect(
      screen.queryByRole("article", { name: "Note" }),
    ).not.toBeInTheDocument();
  });

  it("should reveal the preview while drawing a new note", () => {
    renderBoard();
    const board = screen.getByTestId("board");
    const preview = screen.getByTestId("create-preview");

    expect(preview.style.display).toBe("");

    fireEvent.pointerDown(board, { button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 200, clientY: 200 });

    expect(preview.style.display).toBe("block");
  });

  it("should show a loading state while the active backend is fetching", () => {
    // The rest backend fetches asynchronously; while its store is loading, the
    // board shows the overlay.
    useBackendStore.setState({ kind: "rest" });
    notesRestStore.setState({ status: "loading" });
    renderBoard();

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading notes...");
  });

  it("should hide the notes content while the active backend is loading", () => {
    // Notes must only appear after the loader resolves — never alongside it.
    useBackendStore.setState({ kind: "rest" });
    notesRestStore.setState({
      notes: [createNote({ position: { x: 0, y: 0 } })],
      status: "loading",
    });
    renderBoard();

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.queryByRole("article", { name: "Note" }),
    ).not.toBeInTheDocument();
  });
});
