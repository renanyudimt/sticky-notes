export interface NoteEditorConnectorProps {
  id: string;
  /** Persists the note's text — called (debounced) when the user stops typing. */
  onEditText: (id: string, text: string) => void;
}
