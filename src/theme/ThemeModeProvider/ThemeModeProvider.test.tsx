import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_STORAGE_KEY } from "./constants";
import { ThemeModeProvider } from "./ThemeModeProvider";
import { useThemeMode } from "./useThemeMode";

const mockMatchMedia = (matches: boolean) => {
  const mql = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mql));
};

function Probe() {
  const { mode, toggle } = useThemeMode();
  return (
    <>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggle}>toggle</button>
    </>
  );
}

const renderProbe = () =>
  render(
    <ThemeModeProvider>
      <Probe />
    </ThemeModeProvider>,
  );

describe("ThemeModeProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("should follow the OS preference when no choice is stored", () => {
    mockMatchMedia(true);
    renderProbe();
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("should prefer the stored choice over the OS preference", () => {
    mockMatchMedia(true);
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderProbe();
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("should flip the mode when toggled", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("should persist the chosen mode on toggle", async () => {
    mockMatchMedia(false);
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "toggle" }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
