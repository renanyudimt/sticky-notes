import { useContext } from "react";

import { THEME_MODE_ERROR } from "./constants";
import { ThemeModeContext } from "./context";
import type { ThemeModeContextValue } from "./types";

/** Reads the active theme mode and its controls. Requires a `ThemeModeProvider`. */
export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error(THEME_MODE_ERROR);
  return context;
}
