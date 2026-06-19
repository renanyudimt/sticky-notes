import { X } from "lucide-react";

import { TOAST_STRINGS } from "../constants";
import { dismissToast } from "../toastStore";
import { useToasts } from "../useToasts";
import { ToastClose, ToastItem, ToastMessage, ToastViewport } from "./styles";

export function Toaster() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <ToastViewport aria-label={TOAST_STRINGS.regionLabel}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          $type={toast.type}
          role="status"
          aria-live={toast.type === "error" ? "assertive" : "polite"}
        >
          <ToastMessage>{toast.message}</ToastMessage>
          <ToastClose
            type="button"
            aria-label={TOAST_STRINGS.dismissLabel}
            onClick={() => dismissToast(toast.id)}
          >
            <X />
          </ToastClose>
        </ToastItem>
      ))}
    </ToastViewport>
  );
}
