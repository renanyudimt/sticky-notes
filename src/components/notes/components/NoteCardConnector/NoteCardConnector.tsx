import { memo } from "react";

import { useNoteView } from "../../data";
import { useNotePendingDelete } from "../../dragState";
import { NoteCard } from "../NoteCard";
import type { NoteCardConnectorProps } from "./types";

function NoteCardConnectorBase({ id, ...rest }: NoteCardConnectorProps) {
  const note = useNoteView(id);
  const isPendingDelete = useNotePendingDelete(id);

  if (!note) return null;

  return <NoteCard note={note} isPendingDelete={isPendingDelete} {...rest} />;
}

export const NoteCardConnector = memo(NoteCardConnectorBase);
