"use client";

import { Tabs } from "@heroui/react";

interface PeriodFilterProps {
  period: string;
  setPeriod: (period: string) => void;
}

export default function PeriodFilter({ period, setPeriod }: PeriodFilterProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <span className="font-medium text-sm">Time Period:</span>
      <Tabs
        selectedKey={period}
        onSelectionChange={(key) => setPeriod(String(key))}
        variant="primary"
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Time Period">
            <Tabs.Tab id="all">
              All
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="7d">
              7d
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="15d">
              15d
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="30d">
              30d
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
}
