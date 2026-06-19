import { memo, useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

import { useNoteText } from "../../data";
import { NoteEditor } from "../NoteEditor";
import { NOTE_EDITOR_LABEL, NOTE_TEXT_DEBOUNCE } from "./constants";
import type { NoteEditorConnectorProps } from "./types";

function NoteEditorConnectorBase({ id, onEditText }: NoteEditorConnectorProps) {
  const committedText = useNoteText(id);
  const [value, setValue] = useState(committedText);
  const debouncedValue = useDebounce(value, NOTE_TEXT_DEBOUNCE);

  const lastCommitted = useRef(committedText);

  useEffect(() => {
    if (debouncedValue !== lastCommitted.current) {
      lastCommitted.current = debouncedValue;
      onEditText(id, debouncedValue);
    }
  }, [debouncedValue, id, onEditText]);

  return (
    <NoteEditor value={value} label={NOTE_EDITOR_LABEL} onChange={setValue} />
  );
}

export const NoteEditorConnector = memo(NoteEditorConnectorBase);
