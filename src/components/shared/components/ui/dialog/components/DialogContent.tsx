import { useEffect } from "react";
import { X } from "lucide-react";

import { useDialogContext } from "./context";
import { DialogOverlay } from "./DialogOverlay";
import { DialogPortal } from "./DialogPortal";
import { CloseButton, Content, SrOnly } from "./styles";
import type { DialogContentProps } from "./types";

function DialogContent({ children, ...props }: DialogContentProps) {
  const { open, setOpen } = useDialogContext();

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
      {/* Stop pointer-down here so a click on the overlay (or anything that
          bubbles through the portal's React tree) never reaches interactive
          ancestors behind the modal — e.g. a note's drag handle when the
          dialog is opened from inside a NoteCard. onClick still fires. */}
      <DialogOverlay
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => setOpen(false)}
      />
      <Content role="dialog" {...props}>
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
