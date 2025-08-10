export default function Header() {
  return (
    <header>
      <nav className="navbar flex-none w-full justify-center items-center">
        <div className="navbar-center max-w-6xl flex items-center pt-5 pb-2">
          <img
            src="/boxdgrid-logo.webp"
            alt="BoxdGrid Logo"
            className="w-full max-w-40"
          />
        </div>
      </nav>

      <div className="text-sm px-20 flex justify-center items-center text-center">
        Create grid-style collages of your latest Letterboxd watches
      </div>
    </header>
  );
}
