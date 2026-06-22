import { memo, useCallback, useState } from "react";
import { X } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from "@/components/shared/components/ui";

import { DELETE_NOTE_DIALOG, stopPropagation } from "./constants";
import { NoteDeleteButton } from "./styles";
import type { DeleteNoteDialogProps } from "./types";

function DeleteNoteDialogBase({ onConfirm }: DeleteNoteDialogProps) {
  // Controlled so Cancel (and the confirm path) can close it explicitly; the X
  // doubles as the drag handle, so we don't want a stray instant delete.
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancel = useCallback(() => setOpen(false), []);

  // Awaits the backend delete: the button stays in a loading state for the
  // request, then the dialog closes on success (the card unmounts as the cache
  // updates). On failure the global handler toasts and the dialog stays open.
  const handleConfirm = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // Error surfaced by the global mutation handler; keep the dialog open.
    } finally {
      setIsDeleting(false);
    }
  }, [onConfirm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <NoteDeleteButton
          type="button"
          aria-label={DELETE_NOTE_DIALOG.triggerLabel}
          onPointerDown={stopPropagation}
        >
          <X />
        </NoteDeleteButton>
      </DialogTrigger>

      <DialogContent onPointerDown={stopPropagation}>
        <DialogHeader>
          <DialogTitle>{DELETE_NOTE_DIALOG.title}</DialogTitle>
          <DialogDescription>
            {DELETE_NOTE_DIALOG.description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            {DELETE_NOTE_DIALOG.cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Spinner />}
            {DELETE_NOTE_DIALOG.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const DeleteNoteDialog = memo(DeleteNoteDialogBase);
