export interface ClearAllDialogProps {
  /**
   * Called when the user confirms clearing every note. May return a promise —
   * the dialog shows a loading state until it settles, then closes on success.
   */
  onConfirm: () => Promise<void> | void;
  /** Disables the trigger (e.g. when there are no notes to clear). */
  disabled: boolean;
}
