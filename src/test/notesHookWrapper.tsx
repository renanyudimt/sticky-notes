import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { dataSourceStore } from "@/components/notes";
import type { DataSource } from "@/services/notes";

/**
 * Wrapper for testing the notes data hooks: React Query + the active backend.
 * Defaults to the `local` backend (Zustand); pass `"api"` to test the React
 * Query backend. The backend now lives in the persisted `dataSourceStore`
 * (module singleton), so it is seeded here rather than via a provider prop.
 * Returns the client so an api test can read/seed the cache directly.
 */
export function createNotesHookWrapper(initialDataSource: DataSource = "local") {
  dataSourceStore.setState({ dataSource: initialDataSource });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
}
