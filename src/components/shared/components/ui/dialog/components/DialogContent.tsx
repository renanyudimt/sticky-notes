import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { useFocusTrap } from "../hooks";
import { useDialogContext } from "./context";
import { DialogOverlay } from "./DialogOverlay";
import { DialogPortal } from "./DialogPortal";
import { CloseButton, Content, SrOnly } from "./styles";
import type { DialogContentProps } from "./types";

function DialogContent({ children, ...props }: DialogContentProps) {
  const { open, setOpen } = useDialogContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useFocusTrap(contentRef, open);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay onClick={() => setOpen(false)} />
      <Content
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        {...props}
      >
        {children}
        <CloseButton type="button" onClick={() => setOpen(false)}>
          <X />
          <SrOnly>Close</SrOnly>
        </CloseButton>
      </Content>
    </DialogPortal>
  );
}

export { DialogContent };
