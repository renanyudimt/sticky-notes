import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_MODE_ERROR } from "./constants";
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
  const { mode } = useThemeMode();
  return <span data-testid="mode">{mode}</span>;
}

describe("useThemeMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should expose the active mode when inside a provider", () => {
    mockMatchMedia(false);
    render(
      <ThemeModeProvider>
        <Probe />
      </ThemeModeProvider>,
    );
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("should throw when used outside a provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(THEME_MODE_ERROR);
    spy.mockRestore();
  });
});
