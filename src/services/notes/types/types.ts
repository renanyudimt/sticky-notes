import type { CreateNoteInput, Note } from "@/components/notes";

/**
 * Which simulated backend a request targets. `local` is the user's own storage
 * (instant); `api` is the latency-simulated backend. Each maps to a distinct
 * `localStorage` key, so the two data sources never overlap.
 */
export type DataSource = "local" | "api";

/** The note fields a client may patch — layout, style, and text. */
export type NoteChanges = Partial<
  Pick<Note, "text" | "color" | "position" | "size">
>;

/** Payload for updating a single note. */
export interface UpdateNotePayload {
  id: string;
  changes: NoteChanges;
}

export type { CreateNoteInput, Note };
