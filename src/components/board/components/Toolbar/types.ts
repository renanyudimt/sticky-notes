import type { DataSource } from "@/services/notes";

export interface ToolbarProps {
  noteCount: number;
  dataSource: DataSource;
  /** True while a backend switch is in flight — the toggle is locked to prevent
   * overlapping switches and to signal the pending state at the source. */
  isSwitching: boolean;
  onDataSourceChange: (dataSource: DataSource) => void;
  onClear: () => Promise<void> | void;
  /** Seeds a batch of random empty cards (from the info dialog). */
  onSeed: () => Promise<void> | void;
}
