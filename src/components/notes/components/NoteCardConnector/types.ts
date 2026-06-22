import type { NoteCardProps } from "../NoteCard";

export interface NoteCardConnectorProps extends Omit<
  NoteCardProps,
  "note" | "isPendingDelete" | "zIndex"
> {
  id: string;
}
