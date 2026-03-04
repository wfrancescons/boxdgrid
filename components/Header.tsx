export default function Header() {
  return (
    <header className="flex max-w-md flex-col items-center justify-center gap-2 pt-6">
      <img
        src="boxdgrid-logo.svg"
        alt="BoxdGrid Logo"
        className="w-full max-w-40"
      />
      <span className="text-center text-neutral-100/60 text-xs">
        Create grid-style collages of your latest Letterboxd watches
      </span>
    </header>
  );
}
