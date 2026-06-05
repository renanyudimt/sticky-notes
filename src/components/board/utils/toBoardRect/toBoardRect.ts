import type { Rect } from "@/components/notes";

export function toBoardRect(element: DOMRect, board: DOMRect): Rect {
  return {
    x: element.left - board.left,
    y: element.top - board.top,
    width: element.width,
    height: element.height,
  };
}
