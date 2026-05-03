interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="fade-in zoom-in-50 flex h-full w-full animate-in items-center justify-center p-2 duration-500">
      <img
        src={src}
        alt="Letterboxd collage"
        className="h-full max-h-full w-auto max-w-full select-none rounded-md object-contain"
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      />
    </div>
  );
}
