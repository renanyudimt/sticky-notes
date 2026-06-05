import type { Note } from "@/components/notes";

export interface NotesRepository {
  load(): Promise<Note[]>;
  save(notes: readonly Note[]): Promise<void>;
}

export type RepositoryKind = "local" | "rest";
