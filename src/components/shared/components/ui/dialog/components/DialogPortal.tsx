import { createPortal } from "react-dom";

interface DialogPortalProps {
  children: React.ReactNode;
}

function DialogPortal({ children }: DialogPortalProps) {
  return createPortal(children, document.body);
}

export { DialogPortal };
