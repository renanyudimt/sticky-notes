import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeModeProvider } from "@/theme";

import { ThemeToggle } from "./ThemeToggle";

const mockMatchMedia = (matches: boolean) => {
  const mql = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));
};

const renderToggle = () =>
  render(
    <ThemeModeProvider>
      <ThemeToggle />
    </ThemeModeProvider>,
  );

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should offer to switch to dark mode while in light mode", () => {
    mockMatchMedia(false);
    renderToggle();
    expect(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeInTheDocument();
  });

  it("should offer to switch to light mode while in dark mode", () => {
    mockMatchMedia(true);
    renderToggle();
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });

  it("should switch the mode when clicked", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();
    renderToggle();

    await user.click(
      screen.getByRole("button", { name: "Switch to dark mode" }),
    );

    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });
});
