import { Board } from "@/components/board";
import { NotesProvider } from "@/components/notes";
import { useSystemTheme } from "@/components/shared";

export function App() {
  useSystemTheme();

  return (
    <NotesProvider repositoryKind="local">
      <Board />
    </NotesProvider>
  );
}
