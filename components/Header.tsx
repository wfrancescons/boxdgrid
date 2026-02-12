export default function Header() {
  return (
    <header className="flex flex-col max-w-md justify-center items-center gap-2 pt-5">
      <img
        src="/boxdgrid-logo.webp"
        alt="BoxdGrid Logo"
        className="w-full max-w-40"
      />
      <span className="text-xs text-center text-neutral-100/60">
        Create grid-style collages of your latest Letterboxd watches
      </span>
    </header>
  );
}
