import { MutationCache, QueryClient } from "@tanstack/react-query";

import { toast } from "@/components/shared/components/ui";

import { QUERY_ERROR_MESSAGE } from "./constants";

/**
 * Builds the app's QueryClient. The mutation cache carries a single global error
 * handler — every failed mutation surfaces a `toast.error`. This is why
 * components and hooks never call `toast.error` themselves; they only toast on
 * success. Queries fail silently and are handled via UI (empty/error state).
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        const message =
          error instanceof Error && error.message
            ? error.message
            : QUERY_ERROR_MESSAGE;
        toast.error(message);
      },
    }),
  });
}
