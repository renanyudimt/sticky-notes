import { useNotesQuery } from "@/services/notes";

import { useDataSource } from "../useDataSource";

/** True when the active backend's notes failed to load (api only). */
export function useNotesError(): boolean {
  const { dataSource } = useDataSource();
  const apiError = useNotesQuery("api", undefined, dataSource === "api").isError;
  return dataSource === "api" ? apiError : false;
}
