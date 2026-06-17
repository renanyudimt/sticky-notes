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
  INFO_CONTENT_STYLE,
  InfoIcon,
  InfoItem,
  InfoItemDescription,
  InfoItemTitle,
  InfoList,
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

      <DialogContent style={INFO_CONTENT_STYLE}>
        <DialogHeader>
          <DialogTitle>{INFO_DIALOG.title}</DialogTitle>
          <DialogDescription>{INFO_DIALOG.description}</DialogDescription>
        </DialogHeader>

        <InfoList>
          {INFO_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <InfoItem key={section.title}>
                <InfoIcon aria-hidden>
                  <Icon />
                </InfoIcon>
                <div>
                  <InfoItemTitle>{section.title}</InfoItemTitle>
                  <InfoItemDescription>
                    {section.description}
                  </InfoItemDescription>
                </div>
              </InfoItem>
            );
          })}
        </InfoList>
      </DialogContent>
    </Dialog>
  );
}

// Memoized: InfoDialog is fully static (no props), so it bails on every parent
// re-render. The Toolbar legitimately re-renders when `noteCount` changes
// (count label + Clear all enabled state); this keeps that from re-rendering
// the info button along with it.
export const InfoDialog = memo(InfoDialogBase);
