import { useEffect, useState } from "react";

import { createRepository } from "@/components/persistence";

import { createNotesStore } from "../createNotesStore";
import { NotesStoreContext } from "./context";
import type { NotesProviderProps } from "./types";

export function NotesProvider({
  children,
  repository,
  repositoryKind = "local",
  autoHydrate = true,
  persistDelay,
}: NotesProviderProps) {
  const [store] = useState(() =>
    createNotesStore(repository ?? createRepository(repositoryKind), {
      persistDelay,
      repositoryKind,
    }),
  );

  useEffect(() => {
    if (autoHydrate) {
      void store.getState().hydrate();
    }
  }, [autoHydrate, store]);

  return <NotesStoreContext value={store}>{children}</NotesStoreContext>;
}
