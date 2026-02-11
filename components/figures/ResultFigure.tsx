interface ResultFigureProps {
  src: string;
}

export default function ResultFigure({ src }: ResultFigureProps) {
  return (
    <div className="hover-3d p-1.5">
      {/* content */}
      <figure className="w-full my-1">
        <img
          src={src}
          alt="Letterboxd collage"
          className="rounded-md w-auto h-auto max-h-[60vh] object-contain"
        />
      </figure>
      {/* 8 empty divs needed for the 3D effect */}
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
