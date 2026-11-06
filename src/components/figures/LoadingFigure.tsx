"use client";

import { Skeleton } from "@heroui/react";

export default function LoadingFigure() {
  return (
    <div className="fade-in size-full animate-in p-8 duration-500">
      <Skeleton className="size-full rounded-xl" />
    </div>
  );
}
