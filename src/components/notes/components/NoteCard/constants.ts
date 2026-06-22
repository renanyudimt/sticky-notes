/**
 * Z-index applied to a note while it is being dragged. Lifts the note above its
 * siblings via CSS only — without reordering the notes array (which would move
 * the DOM node mid-gesture and cancel the active pointer drag). The real
 * stacking is committed on drop, in the board controller's `onMoveEnd`.
 */
export const DRAG_Z_INDEX = 9999;
