import { memo } from "react";
import { Info } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/components/ui";

import { INFO_DIALOG, INFO_SECTIONS } from "./constants";
import {
  INFO_ICON,
  INFO_ITEM,
  INFO_ITEM_DESCRIPTION,
  INFO_ITEM_TITLE,
  INFO_LIST,
} from "./styles";

function InfoDialogBase() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={INFO_DIALOG.triggerLabel}
        >
          <Info />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85vh] flex-col">
        <DialogHeader>
          <DialogTitle>{INFO_DIALOG.title}</DialogTitle>
          <DialogDescription>{INFO_DIALOG.description}</DialogDescription>
        </DialogHeader>

        <ul className={INFO_LIST}>
          {INFO_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.title} className={INFO_ITEM}>
                <span className={INFO_ICON} aria-hidden>
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className={INFO_ITEM_TITLE}>{section.title}</p>
                  <p className={INFO_ITEM_DESCRIPTION}>{section.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

// Memoized: InfoDialog is fully static (no props), so it bails on every parent
// re-render. The Toolbar legitimately re-renders when `noteCount` changes
// (count label + Clear all enabled state); this keeps that from re-rendering
// the info button along with it.
export const InfoDialog = memo(InfoDialogBase);
