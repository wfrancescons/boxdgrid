export default function WelcomeFigure() {
  return (
    <figure className="flex items-center justify-center h-[65vh]">
      <img
        src="home-grid.webp"
        alt="Letterboxd collage"
        fetchPriority="high"
        className="max-h-full max-w-full object-contain"
      />
    </figure>
  );
}
