import type { RepositoryKind } from "@/components/persistence";

export interface ToolbarProps {
  noteCount: number;
  repositoryKind: RepositoryKind;
  onRepositoryChange: (kind: RepositoryKind) => void;
  onClear: () => void;
}
