import { ClipboardCheck, FileDown, HeartPlus } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";

import SupportModal from "./SupportModal.tsx";

interface SuccessModalProps {
  isOpen: boolean;
  type: "copy" | "download";
  setOpen: (value: boolean) => void;
}

export default function SuccessModal(
  { isOpen, setOpen, type }: SuccessModalProps,
) {
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const gradientBg = {
    "copy": "bg-radial-[at_50%_15%] from-green-500/15 to-75% to-base-100",
    "download": "bg-radial-[at_50%_15%] from-cyan-500/15 to-75% to-base-100",
  };

  return (
    <dialog
      ref={dialogRef}
      className="md:modal-middle modal modal-bottom"
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
    >
      <div
        className={`modal-box justify-center text-center sm:max-w-sm ${
          gradientBg[type]
        }`}
      >
        <button
          type="button"
          className="btn btn-circle btn-ghost absolute top-2 right-2"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <div className="flex w-full flex-col items-center justify-center gap-5">
          {type === "copy"
            ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-full bg-green-600/10 text-green-200">
                  <ClipboardCheck
                    strokeWidth={2}
                    className="size-12 opacity-85"
                  />
                </div>
                <span className="font-bold text-xl">
                  Collage copied to clipboard
                </span>
              </div>
            )
            : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-200">
                  <FileDown
                    strokeWidth={2}
                    className="size-12 opacity-85"
                  />
                </div>
                <span className="font-bold text-xl">
                  Your download is ready
                </span>
              </div>
            )}

          <div className="flex w-full flex-col gap-2 rounded-2xl bg-yellow-500/25 p-3">
            <div className="opacity-90">
              <p className="font-bold">
                This project is free and ad-free!
              </p>
              <p className="text-sm">
                If you can, support me to keep it online:
              </p>
            </div>
            <button
              type="button"
              className="btn btn-block flex items-center gap-2 border-0 bg-yellow-600 text-white hover:bg-yellow-800"
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
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <p className="text-sm opacity-65">
              Get more out of boxdgrid on Telegram:
            </p>
            <a
              className="btn btn-wide flex items-center border-0 bg-sky-600/20 hover:bg-sky-600/90"
              href="https://t.me/letterboxdgrambot"
              target="_blank"
            >
              <img
                src="https://telegram.org/img/WidgetButton_LogoLarge.png"
                alt="Ko-fi"
                className="inline-block w-5"
              />
              <span>t.me/letterboxdgrambot</span>
            </a>
          </div>
        </div>

        <div className="divider mb-2" />

        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p className="text-sm opacity-65">
            More projects and where to find me:
          </p>
          <a
            className="btn btn-soft btn-wide border-0 bg-teal-600/20 hover:bg-teal-600/90"
            href="https://wfrancescons.gridme.bio/"
            target="_blank"
          >
            Projects & Socials
          </a>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="submit" onClick={() => setOpen(false)}>
          close
        </button>
      </form>
    </dialog>
  );
}
