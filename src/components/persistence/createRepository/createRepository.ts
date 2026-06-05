import { createLocalStorageRepository } from "../localStorageRepository";
import { createMockRestRepository } from "../mockRestRepository";
import type { NotesRepository, RepositoryKind } from "../types";

export function createRepository(kind: RepositoryKind): NotesRepository {
  switch (kind) {
    case "rest":
      return createMockRestRepository();
    case "local":
    default:
      return createLocalStorageRepository();
  }
}
