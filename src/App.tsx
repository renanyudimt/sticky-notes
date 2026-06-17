import { Board } from "@/components/board";
import { ThemeModeProvider } from "@/theme";

export function App() {
  return (
    <ThemeModeProvider>
      <Board />
    </ThemeModeProvider>
  );
}
