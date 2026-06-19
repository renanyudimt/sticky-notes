export interface DeleteNoteDialogProps {
  /**
   * Called when the user confirms deletion. Pre-bound to the note's id. May
   * return a promise — the dialog shows a loading state until it settles, then
   * closes on success.
   */
  onConfirm: () => Promise<void> | void;
}
