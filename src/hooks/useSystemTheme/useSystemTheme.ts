import { useEffect } from "react";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function useSystemTheme(): void {
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(DARK_QUERY);
    const apply = (matches: boolean) => {
      document.documentElement.classList.toggle("dark", matches);
    };

    apply(media.matches);
    const onChange = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);
}
