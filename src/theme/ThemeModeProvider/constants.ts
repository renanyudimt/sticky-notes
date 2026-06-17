/** localStorage key holding the user's explicit theme choice. */
export const THEME_STORAGE_KEY = "sticky-notes:theme";

/** Thrown when `useThemeMode` is called outside of a `ThemeModeProvider`. */
export const THEME_MODE_ERROR =
  "useThemeMode must be used within a ThemeModeProvider";
