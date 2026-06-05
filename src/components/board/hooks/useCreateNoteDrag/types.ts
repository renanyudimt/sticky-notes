import type { Rect } from "@/components/notes";

export interface UseCreateNoteDragParams {
  getBoardRect: () => DOMRect | null;
  onCreate: (rect: Rect) => void;
}

export interface UseCreateNoteDragResult {
  isCreating: boolean;
  previewRect: Rect | null;
  startCreate: (event: React.PointerEvent) => void;
}
