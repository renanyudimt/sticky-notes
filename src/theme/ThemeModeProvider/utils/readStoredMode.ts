import type { ThemeMode } from "../../types";
import { THEME_STORAGE_KEY } from "../constants";

/** Reads the persisted theme choice, or null when absent/invalid/unavailable. */
export function readStoredMode(): ThemeMode | null {
  if (typeof window === "undefined" || !window.localStorage) return null;

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}
