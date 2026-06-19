import type { DataSource } from "@/services/notes";

/** The shape returned by `useDataSource` — the active backend and its setter. */
export interface DataSourceContextValue {
  /** The active backend the notes hooks read from. */
  dataSource: DataSource;
  setDataSource: (dataSource: DataSource) => void;
}
