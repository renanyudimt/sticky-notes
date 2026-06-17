import { useCallback, useMemo, useState } from "react";
import { ThemeProvider } from "styled-components";

import { useSystemTheme } from "@/components/shared";

import { GlobalStyles } from "../GlobalStyles";
import { themes } from "../theme";
import type { ThemeMode } from "../types";
import { ThemeModeContext } from "./context";
import type { ThemeModeProviderProps } from "./types";
import { readStoredMode, writeStoredMode } from "./utils";

export function ThemeModeProvider({ children }: ThemeModeProviderProps) {
  const systemMode = useSystemTheme();
  const [override, setOverride] = useState<ThemeMode | null>(readStoredMode);

  const mode = override ?? systemMode;

  const setMode = useCallback((next: ThemeMode) => {
    setOverride(next);
    writeStoredMode(next);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, toggle, setMode }),
    [mode, toggle, setMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={themes[mode]}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
