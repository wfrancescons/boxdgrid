import GithubIcon from "@/components/icons/GithubIcon.tsx";
import TelegramIcon from "@/components/icons/TelegramIcon.tsx";
import { HeartPlus } from "lucide-preact";
import { useState } from "preact/hooks";

import SupportModal from "./modals/SupportModal.tsx";

export default function Footer() {
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  return (
    <footer className="footer md:footer-horizontal items-center bg-base-300/25 py-2 text-neutral-content md:py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 p-4 md:flex-row">
        <aside className="flex flex-col items-center gap-1 text-base-content md:items-start">
          <span>
            © {new Date().getFullYear()} -{" "}
            <a
              className="link m-0 p-0 font-semibold"
              href="https://wfrancescons.gridme.bio/"
              target="_blank"
            >
              Wesley Francescon
            </a>
          </span>
          <span className="text-base-content/60 text-xs">
            This project is not associated with Letterboxd.
          </span>
        </aside>
        <nav className="flex items-center gap-4">
          <button
            type="button"
            className="btn btn-outline btn-sm text-white hover:bg-yellow-600"
            onClick={() => setSupportModalOpen(true)}
          >
            <HeartPlus
              strokeWidth={3}
              className="size-4"
            />
            Support this project
          </button>
          <SupportModal
            isOpen={supportModalOpen}
            setOpen={setSupportModalOpen}
          />
          <div className="divider divider-horizontal m-0" />
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://t.me/letterboxdgrambot"
              target="_blank"
              aria-label="Open letterboxdgram on Telegram"
            >
              <TelegramIcon className="h-6 w-6 fill-current" />
            </a>
            <a
              href="https://github.com/wfrancescons/boxdgrid"
              target="_blank"
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
