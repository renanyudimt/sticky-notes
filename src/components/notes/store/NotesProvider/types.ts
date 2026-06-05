import type { ReactNode } from "react";

import type { NotesRepository, RepositoryKind } from "@/components/persistence";

export interface NotesProviderProps {
  children: ReactNode;
  repository?: NotesRepository;
  repositoryKind?: RepositoryKind;
  autoHydrate?: boolean;
  persistDelay?: number;
}
