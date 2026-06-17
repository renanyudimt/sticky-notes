import type { ReactNode } from "react";

import type { ThemeMode } from "../types";

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export interface ThemeModeProviderProps {
  children: ReactNode;
}
