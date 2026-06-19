export interface DragState {
  /** The note currently being dragged, or null when idle. */
  draggingId: string | null;
  /** Whether the dragged note is hovering the trash zone. */
  isOverTrash: boolean;
}
