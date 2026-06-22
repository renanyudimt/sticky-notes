import { render, screen } from "@/test/renderWithTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createNote,
  dataSourceStore,
  resetDataSourceStore,
  resetNotesStore,
} from "@/components/notes";
import { saveNotes, type DataSource } from "@/services/notes";
import { ThemeModeProvider } from "@/theme";

import { Board } from "./Board";

const renderBoard = (initialDataSource: DataSource = "local") => {
  dataSourceStore.setState({ dataSource: initialDataSource });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </QueryClientProvider>
  );

  return render(<Board />, { wrapper });
};

describe("Board", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetNotesStore();
    window.localStorage.clear();
  });

  afterEach(() => {
    resetNotesStore();
    resetDataSourceStore();
    window.localStorage.clear();
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

    expect(
      await screen.findByRole("article", { name: "Note" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("1 note")).toBeInTheDocument();
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

  it("should show a loading state while the API backend is fetching", () => {
    // The API backend fetches asynchronously; while the query is pending, the
    // board shows the loading overlay.
    renderBoard("api");

    expect(screen.getByRole("status")).toHaveTextContent("Loading notes...");
  });

  it("should hide the notes content while the API backend is loading", () => {
    // Notes must only appear after the query resolves — never alongside loading.
    saveNotes("api", [createNote({ position: { x: 0, y: 0 } })]);
    renderBoard("api");

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.queryByRole("article", { name: "Note" }),
    ).not.toBeInTheDocument();
  });
});
