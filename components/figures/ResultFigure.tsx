interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="md:hover-3d size-fit rounded-md animate-in fade-in zoom-in-50 duration-500">
      <figure className="w-full h-full rounded-md overflow-hidden">
        <img
          src={src}
          alt="Letterboxd collage"
          className="w-full h-full max-h-[60vh] object-contain"
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
