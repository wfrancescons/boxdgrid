import GithubIcon from "./icons/GithubIcon.tsx";
import TelegramIcon from "./icons/TelegramIcon.tsx";

export default function Footer() {
  return (
    <footer className="footer md:footer-horizontal bg-base-300 text-neutral-content items-center py-2 md:py-4">
      <div className="w-full max-w-3xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <aside className="flex flex-col items-center md:items-start gap-1 text-base-content">
          <span>
            © {new Date().getFullYear()} -{" "}
            <a
              className="link link-hover font-semibold p-0 m-0"
              href="https://bento.me/wfrancescons"
              target="_blank"
              rel="noopener"
            >
              Wesley Francescon
            </a>
          </span>
          <span className="text-xs text-base-content/60">
            This project is not associated with Letterboxd.
          </span>
        </aside>
        <nav className="flex gap-4 items-center">
          <a
            href="https://ko-fi.com/wfrancescons"
            target="_blank"
            rel="noopener"
            className="btn btn-soft btn-sm"
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
              <TelegramIcon className="fill-current w-6 h-6" />
            </a>
            <a
              href="https://github.com/wfrancescons"
              target="_blank"
              rel="noopener"
              aria-label="Visit my GitHub profile"
            >
              <GithubIcon className="fill-current w-6 h-6" />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
