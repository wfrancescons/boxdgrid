import { Signal } from "@preact/signals";

interface ResultFigureProps {
  src: Signal<string>;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <figure className="w-full my-1">
      <img
        src={src.value}
        alt="Letterboxd collage"
        className="rounded-md w-auto h-auto max-h-[60vh] object-contain"
      />
    </figure>
  );
}
