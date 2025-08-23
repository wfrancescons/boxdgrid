export default function WelcomeFigure() {
  return (
    <figure className="w-full">
      <img
        src="/home-grid.webp"
        alt="Letterboxd collage"
        fetchPriority="high"
        className="rounded-md w-auto h-auto max-h-[65vh] object-contain"
      />
    </figure>
  );
}
