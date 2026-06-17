import { useEffect, useState } from "react";

import type { ThemeMode } from "@/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function useSystemTheme(): ThemeMode {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(DARK_QUERY);
    const apply = (matches: boolean) => setMode(matches ? "dark" : "light");

    apply(media.matches);
    const onChange = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  return mode;
}
