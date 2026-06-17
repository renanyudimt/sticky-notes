import { memo } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/shared/components/ui";
import { useThemeMode } from "@/theme";

import { THEME_TOGGLE } from "./constants";

function ThemeToggleBase() {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? THEME_TOGGLE.toLight : THEME_TOGGLE.toDark}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

// Memoized: consumes the theme context directly (no props), so it only
// re-renders when the mode actually changes — not when the Toolbar re-renders
// for an unrelated reason (e.g. note count).
export const ThemeToggle = memo(ThemeToggleBase);
