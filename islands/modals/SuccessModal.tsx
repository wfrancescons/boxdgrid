import { ClipboardCheck, FileDown, HeartPlus } from "lucide-preact";
import { useEffect, useRef } from "preact/hooks";

interface CopiedModalProps {
  isOpen: boolean;
  type: "copy" | "download";
  setOpen: (value: boolean) => void;
}

export default function CopiedModal(
  { isOpen, setOpen, type }: CopiedModalProps,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={() => setOpen(false)}
    >
      <div className="modal-box justify-center sm:max-w-sm">
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
                <div className="flex size-30 items-center justify-center rounded-full bg-green-600/10 text-green-200">
                  <ClipboardCheck
                    strokeWidth={1.5}
                    className="size-16 opacity-85"
                  />
                </div>
                <span className="text-center font-bold text-xl">
                  Collage copied to clipboard
                </span>
              </div>
            )
            : (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex size-30 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-200">
                  <FileDown
                    strokeWidth={1.5}
                    className="size-16 opacity-85"
                  />
                </div>
                <span className="text-center font-bold text-xl">
                  Your download is ready
                </span>
              </div>
            )}

          <div className="flex w-full flex-col gap-2 rounded-2xl bg-yellow-500/25 p-3">
            <div className="flex flex-row items-center justify-center gap-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-yellow-500/50 text-yellow-200">
                <HeartPlus
                  strokeWidth={3}
                  className="size-5 opacity-85"
                />
              </div>
              <div className="opacity-90">
                <p className="font-bold">
                  This project is free and ad-free!
                </p>
                <p className="text-sm">
                  If you can, support me to keep it online:
                </p>
              </div>
            </div>
            <a
              className="btn btn-block flex items-center gap-2 border-0 bg-yellow-600 text-white hover:bg-yellow-800"
              href="https://ko-fi.com/wfrancescons"
              target="_blank"
            >
              <img
                src="https://storage.ko-fi.com/cdn/cup-border.png"
                alt="Ko-fi"
                className="inline-block h-4 w-5"
              />
              <span>Support on Ko-fi</span>
            </a>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <p className="opacity-65">
              Get more out of boxdgrid on Telegram:
            </p>
            <a
              className="btn btn-wide flex items-center gap-2 border-0 bg-sky-600/20 hover:bg-sky-600/90"
              href="https://t.me/letterboxdgrambot"
              target="_blank"
            >
              <img
                src="https://telegram.org/img/WidgetButton_LogoLarge.png"
                alt="Ko-fi"
                className="inline-block w-6"
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
