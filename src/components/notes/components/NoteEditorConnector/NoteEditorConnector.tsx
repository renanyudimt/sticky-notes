import { memo, useCallback } from "react";

import { useNoteActions, useNoteText } from "../../store";
import { NoteEditor } from "../NoteEditor";
import { NOTE_EDITOR_LABEL } from "./constants";
import type { NoteEditorConnectorProps } from "./types";

function NoteEditorConnectorBase({ id }: NoteEditorConnectorProps) {
  const text = useNoteText(id);
  const { editNoteText } = useNoteActions();

  const handleChange = useCallback(
    (value: string) => editNoteText(id, value),
    [editNoteText, id],
  );

  return (
    <NoteEditor value={text} label={NOTE_EDITOR_LABEL} onChange={handleChange} />
  );
}

// Subscribes to its own note's text slice (a primitive selector), so typing
// re-renders only this editor and its textarea — never the surrounding card
// chrome (header, delete button, color picker, resize handles).
export const NoteEditorConnector = memo(NoteEditorConnectorBase);
