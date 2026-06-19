import { notesLocalStore } from "../notesLocalStore";

/**
 * A single local note's text. A primitive selector, so editing one note's text
 * re-renders only that note's editor — never the card chrome or its siblings.
 */
export function useLocalNoteText(id: string): string {
  return notesLocalStore(
    (state) => state.notes.find((note) => note.id === id)?.text ?? "",
  );
}
