import type { NoteColor } from "@/components/notes";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface NoteSurfaceColor {
  bg: string;
  border: string;
}

export type ToastKind = "success" | "error";

export interface ToastSurface {
  bg: string;
  border: string;
  fg: string;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeShadow {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
}

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  radius: ThemeRadius;
  shadow: ThemeShadow;
  noteColors: Record<NoteColor, NoteSurfaceColor>;
  toast: Record<ToastKind, ToastSurface>;
  font: { sans: string };
}
