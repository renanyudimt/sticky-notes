import type { NoteCardProps } from "../NoteCard";

/**
 * NoteCard's props, minus the bits the connector sources from the store by
 * `id`: the note itself and its pending-delete (trash-hover) flag.
 */
export interface NoteCardConnectorProps
  extends Omit<NoteCardProps, "note" | "isPendingDelete"> {
  id: string;
}
