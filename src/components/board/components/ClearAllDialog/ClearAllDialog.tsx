import { memo, useCallback, useState } from "react";
import { Trash2 } from "lucide-react";

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

import { BOARD_STRINGS } from "../../constants";
import { CLEAR_ALL_DIALOG } from "./constants";
import type { ClearAllDialogProps } from "./types";

function ClearAllDialogBase({ onConfirm, disabled }: ClearAllDialogProps) {
  // Controlled so Cancel (and the confirm path) can close it explicitly, and so
  // a guarded destructive action never fires on the first click.
  const [open, setOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleCancel = useCallback(() => setOpen(false), []);

  // Awaits the backend clear: the confirm button shows a loading state, then the
  // dialog closes on success. On failure the global handler toasts; stays open.
  const handleConfirm = useCallback(async () => {
    setIsClearing(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // Error surfaced by the global mutation handler; keep the dialog open.
    } finally {
      setIsClearing(false);
    }
  }, [onConfirm]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Trash2 />
          {BOARD_STRINGS.clear}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CLEAR_ALL_DIALOG.title}</DialogTitle>
          <DialogDescription>{CLEAR_ALL_DIALOG.description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isClearing}
          >
            {CLEAR_ALL_DIALOG.cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isClearing}
          >
            {isClearing && <Spinner />}
            {CLEAR_ALL_DIALOG.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const ClearAllDialog = memo(ClearAllDialogBase);
