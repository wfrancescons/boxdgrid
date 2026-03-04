interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="fade-in md:hover-3d zoom-in-50 h-full w-fit animate-in rounded-md duration-500">
      <figure className="overflow-hidden rounded-md">
        <img
          src={src}
          alt="Letterboxd collage"
          className="h-auto max-h-full w-auto max-w-full object-contain"
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
