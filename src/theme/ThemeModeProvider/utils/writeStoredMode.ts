import type { ThemeMode } from "../../types";
import { THEME_STORAGE_KEY } from "../constants";

export function writeStoredMode(mode: ThemeMode): void {
  if (typeof window === "undefined" || !window.localStorage) return;

  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
}
