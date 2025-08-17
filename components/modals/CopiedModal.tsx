import { Signal } from "@preact/signals";
import TelegramIcon from "../icons/TelegramIcon.tsx";

interface CopiedModalProps {
  toggle: Signal<boolean>;
}

export default function CopiedModal(
  { toggle }: CopiedModalProps,
) {
  return (
    <dialog className="modal" open={toggle.value}>
      <div className="modal-box sm:max-w-sm">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => (toggle.value = false)}
        >
          ✕
        </button>

        <h3 className="font-bold text-xl">Collage copied to clipboard!</h3>
        <p className="py-4">Get more out of boxdgrid on Telegram:</p>

        <a
          className="btn btn-block bg-sky-600 text-white border-sky-600"
          href="https://t.me/letterboxdgrambot"
          target="_blank"
          rel="noopener"
        >
          <TelegramIcon className="fill-current w-4 h-4" />
          <span>t.me/letterboxdgram</span>
        </a>

        <div className="divider" />

        <p className="pb-4">
          <span className="font-bold">This project is free and ad-free!</span>
          {" "}
          <span>If you can, support boxdgrid to help keep it online:</span>
        </p>

        <a
          className="btn btn-block bg-indigo-400 text-white border-indigo-400 flex items-center gap-2"
          href="https://ko-fi.com/wfrancescons"
          target="_blank"
          rel="noopener"
        >
          <img
            src="https://storage.ko-fi.com/cdn/cup-border.png"
            alt="Ko-fi"
            className="inline-block h-4 w-5"
          />
          <span>Support on Ko-fi</span>
        </a>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={() => (toggle.value = false)}>
          close
        </button>
      </form>
    </dialog>
  );
}
