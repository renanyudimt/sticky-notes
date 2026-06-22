/** A single-note write action that round-trips the API backend. */
export type NoteActivity = "creating" | "editing" | "deleting";

/**
 * In-flight counts per write action. Counters (not booleans) because actions
 * overlap — e.g. one drop commits an edit while another is still settling, or a
 * delete fires while an edit is in flight. The action is "active" while its
 * count is above zero.
 */
export interface ActivityState {
  creating: number;
  editing: number;
  deleting: number;
}
