"use client";

interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="flex h-full w-full min-h-0 flex-1 items-center justify-center overflow-hidden p-1">
      <img
        src={src}
        alt="Letterboxd collage"
        className="max-h-full max-w-full w-auto h-auto object-contain select-none rounded-md shadow-sm"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />
    </div>
  );
}
