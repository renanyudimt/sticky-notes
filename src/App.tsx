import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@/query";
import { Board } from "@/components/board";
import { Toaster } from "@/components/shared/components/ui";
import { ThemeModeProvider } from "@/theme";

export function App() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <Board />
        <Toaster />
      </ThemeModeProvider>
    </QueryClientProvider>
  );
}
