import type { RepositoryKind } from "@/components/persistence";

export interface ToolbarProps {
  noteCount: number;
  repositoryKind: RepositoryKind;
  /** True while a backend switch is in flight — the toggle is locked to prevent
   * overlapping switches and to signal the pending state at the source. */
  isSwitching: boolean;
  onRepositoryChange: (kind: RepositoryKind) => void;
  onClear: () => void;
}
