"use client";

import { Tabs } from "@heroui/react";

interface PeriodFilterProps {
  period: string;
  setPeriod: (period: string) => void;
}

export default function PeriodFilter({ period, setPeriod }: PeriodFilterProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <span className="font-medium text-sm">Time Period:</span>
      <Tabs
        selectedKey={period}
        onSelectionChange={(key) => setPeriod(String(key))}
        variant="primary"
        className="w-full"
      >
        <Tabs.ListContainer className="w-full">
          <Tabs.List aria-label="Time Period" className="flex w-full p-0.5">
            <Tabs.Tab id="all" className="h-7 flex-1 px-1 text-xs">
              ALL
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="7d" className="h-7 flex-1 px-1 text-xs">
              7D
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="15d" className="h-7 flex-1 px-1 text-xs">
              15D
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="30d" className="h-7 flex-1 px-1 text-xs">
              30D
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
}
