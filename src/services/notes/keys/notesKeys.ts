import type { DataSource } from "../types";

/**
 * React Query key factory for the notes domain. The list key is scoped by
 * data source, so switching Local ⇄ API is a different cache entry and triggers
 * its own fetch + loading state.
 */
export const notesKeys = {
  all: ["notes"] as const,
  list: (dataSource: DataSource) => ["notes", dataSource] as const,
};
