"use client";

import {
  Button,
  Description,
  Popover,
  Switch,
  SwitchGroup,
} from "@heroui/react";
import { Layers } from "lucide-react";
import { memo } from "react";

interface DisplayOptionsProps {
  showTitles: boolean;
  setShowTitles: (value: boolean) => void;
  showRatings: boolean;
  setShowRatings: (value: boolean) => void;
  className?: string;
}

export default memo(function DisplayOptions({
  showTitles,
  setShowTitles,
  showRatings,
  setShowRatings,
  className = "",
}: DisplayOptionsProps) {
  return (
    <div className={className}>
      <Popover>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Layers className="size-3.5" />
          <span>Overlays</span>
        </Button>
        <Popover.Content className="w-64 p-3 shadow-lg">
          <Popover.Dialog className="flex flex-col gap-3 outline-none">
            <div className="flex flex-col gap-0.5 border-b border-border/50 pb-2">
              <Popover.Heading className="font-semibold text-xs tracking-wide text-foreground">
                Overlay Settings
              </Popover.Heading>
              <span className="text-[11px] text-muted">
                Customize text and badge layers
              </span>
            </div>

            <SwitchGroup className="flex flex-col gap-3 pt-0.5">
              <Switch
                size="sm"
                isSelected={showTitles}
                onChange={setShowTitles}
                aria-label="Toggle movie titles"
              >
                <Switch.Content>
                  <Switch.Control className="[--switch-control-bg-checked-hover:var(--success)] [--switch-control-bg-checked:var(--success)]">
                    <Switch.Thumb />
                  </Switch.Control>
                  <span className="text-xs font-medium text-foreground">
                    Movie titles
                  </span>
                </Switch.Content>
                <Description className="text-[11px] text-muted">
                  Show titles on posters
                </Description>
              </Switch>

              <Switch
                size="sm"
                isSelected={showRatings}
                onChange={setShowRatings}
                aria-label="Toggle ratings and badges"
              >
                <Switch.Content>
                  <Switch.Control className="[--switch-control-bg-checked-hover:var(--success)] [--switch-control-bg-checked:var(--success)]">
                    <Switch.Thumb />
                  </Switch.Control>
                  <span className="text-xs font-medium text-foreground">
                    Ratings & badges
                  </span>
                </Switch.Content>
                <Description className="text-[11px] text-muted">
                  Stars, reviews & rewatches
                </Description>
              </Switch>
            </SwitchGroup>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
});
