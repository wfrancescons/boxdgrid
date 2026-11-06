"use client";

import {
  Button,
  Description,
  Popover,
  Switch,
  SwitchGroup,
  useMediaQuery,
} from "@heroui/react";
import { Layers } from "lucide-react";
import { memo } from "react";

interface DisplayOptionsProps {
  showTitles: boolean;
  setShowTitles: (value: boolean) => void;
  showRatings: boolean;
  setShowRatings: (value: boolean) => void;
}

export default memo(function DisplayOptions({
  showTitles,
  setShowTitles,
  showRatings,
  setShowRatings,
}: DisplayOptionsProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Popover>
      <Button variant="tertiary" size="sm">
        <Layers />
        <span>Overlays</span>
      </Button>
      <Popover.Content className="w-64 shadow-lg">
        <Popover.Dialog className="flex flex-col">
          <Popover.Heading>
            Overlay Settings:
          </Popover.Heading>

          <SwitchGroup className="mt-3">
            <Switch
              size={isMobile ? "md" : "sm"}
              isSelected={showTitles}
              onChange={setShowTitles}
              aria-label="Toggle movie titles"
            >
              <Switch.Content>
                <Switch.Control className="[--switch-control-bg-checked-hover:var(--success)] [--switch-control-bg-checked:var(--success)]">
                  <Switch.Thumb />
                </Switch.Control>
                Movie titles
              </Switch.Content>
              <Description>
                Show titles on posters
              </Description>
            </Switch>

            <Switch
              size={isMobile ? "md" : "sm"}
              isSelected={showRatings}
              onChange={setShowRatings}
              aria-label="Toggle ratings and badges"
            >
              <Switch.Content>
                <Switch.Control className="[--switch-control-bg-checked-hover:var(--success)] [--switch-control-bg-checked:var(--success)]">
                  <Switch.Thumb />
                </Switch.Control>
                Ratings & badges
              </Switch.Content>
              <Description>
                Stars, reviews & rewatches
              </Description>
            </Switch>
          </SwitchGroup>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
});
