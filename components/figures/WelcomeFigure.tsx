export default function WelcomeFigure() {
  return (
    <figure className="flex h-[65vh] items-center justify-center">
      <img
        src="home-grid.webp"
        alt="Letterboxd collage"
        fetchPriority="high"
        className="max-h-full max-w-full object-contain"
      />
    </figure>
  );
}
