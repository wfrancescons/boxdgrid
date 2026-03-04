import GithubIcon from "./icons/GithubIcon.tsx";
import TelegramIcon from "./icons/TelegramIcon.tsx";

export default function Footer() {
  return (
    <footer className="footer md:footer-horizontal items-center bg-base-300/25 py-2 text-neutral-content md:py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 p-4 md:flex-row">
        <aside className="flex flex-col items-center gap-1 text-base-content md:items-start">
          <span>
            © {new Date().getFullYear()} -{" "}
            <a
              className="link m-0 p-0 font-semibold"
              href="https://letterboxd.com/wfrancescons/"
              target="_blank"
              rel="noopener"
            >
              Wesley Francescon
            </a>
          </span>
          <span className="text-base-content/60 text-xs">
            This project is not associated with Letterboxd.
          </span>
        </aside>
        <nav className="flex items-center gap-4">
          <a
            href="https://ko-fi.com/wfrancescons"
            target="_blank"
            rel="noopener"
            className="btn btn-outline btn-sm hover:bg-indigo-400"
            aria-label="Support me on Ko-fi"
          >
            <img
              src="https://storage.ko-fi.com/cdn/cup-border.png"
              alt="Ko-fi"
              className="inline-block h-3 w-4"
            />
            Support on Ko-fi
          </a>
          <div className="divider divider-horizontal m-0" />
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://t.me/letterboxdgrambot"
              target="_blank"
              rel="noopener"
              aria-label="Open letterboxdgram on Telegram"
            >
              <TelegramIcon className="h-6 w-6 fill-current" />
            </a>
            <a
              href="https://github.com/wfrancescons"
              target="_blank"
              rel="noopener"
              aria-label="Visit my GitHub profile"
            >
              <GithubIcon className="h-6 w-6 fill-current" />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
