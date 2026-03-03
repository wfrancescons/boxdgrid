interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="md:hover-3d w-fit h-full rounded-md animate-in fade-in zoom-in-50 duration-500">
      <figure className="rounded-md overflow-hidden">
        <img
          src={src}
          alt="Letterboxd collage"
          className="max-h-full max-w-full h-auto w-auto object-contain"
        />
      </figure>

      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
