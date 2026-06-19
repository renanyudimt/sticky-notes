import type { DataSource } from "@/services/notes";

/**
 * The active-backend state + its setter. Only `dataSource` is persisted; the
 * setter is recreated on each load by the `persist` middleware.
 */
export interface DataSourceState {
  /** The active backend the notes hooks read from. */
  dataSource: DataSource;
  /** Switch the active backend. */
  setDataSource: (dataSource: DataSource) => void;
}
