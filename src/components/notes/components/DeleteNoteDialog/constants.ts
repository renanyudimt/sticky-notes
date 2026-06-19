export const DELETE_NOTE_DIALOG = {
  triggerLabel: "Delete note",
  title: "Delete note?",
  description: "This note will be permanently removed. This can't be undone.",
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
} as const;

/** Keeps a pointer-down on the trigger from starting a header move-drag. */
export const stopPropagation = (event: React.PointerEvent) =>
  event.stopPropagation();
