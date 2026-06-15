import { memo } from "react";

import { useNote, useNotePendingDelete } from "../../store";
import { NoteCard } from "../NoteCard";
import type { NoteCardConnectorProps } from "./types";

function NoteCardConnectorBase({ id, ...rest }: NoteCardConnectorProps) {
  const note = useNote(id);
  // Subscribed here (not passed from the board) so crossing the trash zone
  // re-renders only the dragged note — never the board.
  const isPendingDelete = useNotePendingDelete(id);
  if (!note) return null;
  return <NoteCard note={note} isPendingDelete={isPendingDelete} {...rest} />;
}

// Subscribes to its own note slice, so moving one note re-renders only its
// connector — never the board or its siblings. Memoized so a board re-render
// (focus/reorder/add/remove) skips connectors whose props are unchanged.
export const NoteCardConnector = memo(NoteCardConnectorBase);
