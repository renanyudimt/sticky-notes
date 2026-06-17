import { createContext, useContext } from "react";

import type { DialogContextValue } from "./types";

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
}
