"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center">
      {children}
    </div>
  );
}


