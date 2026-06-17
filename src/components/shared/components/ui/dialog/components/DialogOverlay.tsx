import { Overlay } from "./styles";
import type { DialogOverlayProps } from "./types";

function DialogOverlay(props: DialogOverlayProps) {
  return <Overlay {...props} />;
}

export { DialogOverlay };
