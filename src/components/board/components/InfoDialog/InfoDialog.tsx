import { memo, useCallback, useState } from "react";
import { Info, Sparkles } from "lucide-react";

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

import { INFO_DIALOG, INFO_SECTIONS } from "./constants";
import {
  INFO_CONTENT_STYLE,
  InfoIcon,
  InfoItem,
  InfoItemDescription,
  InfoItemTitle,
  InfoList,
} from "./styles";
import type { InfoDialogProps } from "./types";

function InfoDialogBase({ onSeed }: InfoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Seeds the cards, then closes the dialog on success so the result is visible.
  const handleSeed = useCallback(async () => {
    setIsSeeding(true);
    try {
      await onSeed();
      setOpen(false);
    } catch {
      // Error surfaced by the global mutation handler; keep the dialog open.
    } finally {
      setIsSeeding(false);
    }
  }, [onSeed]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <DialogFooter>
          <Button variant="outline" onClick={handleSeed} disabled={isSeeding}>
            {isSeeding ? <Spinner /> : <Sparkles />}
            {INFO_DIALOG.seedLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const InfoDialog = memo(InfoDialogBase);
