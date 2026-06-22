import type {
  AppTheme,
  NoteSurfaceColor,
  ThemeColors,
  ThemeRadius,
  ThemeShadow,
  ToastKind,
  ToastSurface,
} from "./types";
import type { NoteColor } from "@/components/notes";

const RADIUS_BASE = "0.625rem";

const radius: ThemeRadius = {
  sm: `calc(${RADIUS_BASE} - 4px)`,
  md: `calc(${RADIUS_BASE} - 2px)`,
  lg: RADIUS_BASE,
  xl: `calc(${RADIUS_BASE} + 4px)`,
};

const shadow: ThemeShadow = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  xl2: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
};

const noteColors: Record<NoteColor, NoteSurfaceColor> = {
  yellow: { bg: "#fde68a", border: "#fcd34d" },
  pink: { bg: "#fbcfe8", border: "#f9a8d4" },
  blue: { bg: "#bae6fd", border: "#7dd3fc" },
  green: { bg: "#a7f3d0", border: "#6ee7b7" },
  purple: { bg: "#ddd6fe", border: "#c4b5fd" },
  orange: { bg: "#fed7aa", border: "#fdba74" },
};

const lightToast: Record<ToastKind, ToastSurface> = {
  success: { bg: "#dcfce7", border: "#86efac", fg: "#166534" },
  error: { bg: "#fee2e2", border: "#fca5a5", fg: "#991b1b" },
};

const darkToast: Record<ToastKind, ToastSurface> = {
  success: { bg: "#052e16", border: "#166534", fg: "#bbf7d0" },
  error: { bg: "#450a0a", border: "#991b1b", fg: "#fecaca" },
};

const font = { sans: "system-ui, 'Segoe UI', Roboto, sans-serif" };

const lightColors: ThemeColors = {
  background: "oklch(0.985 0.002 247)",
  foreground: "oklch(0.21 0.006 285)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.21 0.006 285)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.21 0.006 285)",
  primary: "oklch(0.21 0.006 285)",
  primaryForeground: "oklch(0.985 0 0)",
  secondary: "oklch(0.967 0.001 286)",
  secondaryForeground: "oklch(0.21 0.006 285)",
  muted: "oklch(0.967 0.001 286)",
  mutedForeground: "oklch(0.552 0.016 285)",
  accent: "oklch(0.967 0.001 286)",
  accentForeground: "oklch(0.21 0.006 285)",
  destructive: "oklch(0.577 0.245 27)",
  destructiveForeground: "oklch(0.985 0 0)",
  border: "oklch(0.92 0.004 286)",
  input: "oklch(0.92 0.004 286)",
  ring: "oklch(0.705 0.015 286)",
};

const darkColors: ThemeColors = {
  background: "oklch(0.16 0.004 285)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.21 0.006 285)",
  cardForeground: "oklch(0.985 0 0)",
  popover: "oklch(0.21 0.006 285)",
  popoverForeground: "oklch(0.985 0 0)",
  primary: "oklch(0.92 0.004 286)",
  primaryForeground: "oklch(0.21 0.006 285)",
  secondary: "oklch(0.274 0.006 286)",
  secondaryForeground: "oklch(0.985 0 0)",
  muted: "oklch(0.274 0.006 286)",
  mutedForeground: "oklch(0.705 0.015 286)",
  accent: "oklch(0.274 0.006 286)",
  accentForeground: "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22)",
  destructiveForeground: "oklch(0.985 0 0)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.552 0.016 285)",
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: lightColors,
  radius,
  shadow,
  noteColors,
  toast: lightToast,
  font,
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: darkColors,
  radius,
  shadow,
  noteColors,
  toast: darkToast,
  font,
};

export const themes: Record<AppTheme["mode"], AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
