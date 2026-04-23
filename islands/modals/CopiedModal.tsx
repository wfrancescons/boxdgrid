import { ClipboardCheck, LayoutTemplate } from "lucide-preact";
import { useEffect, useRef } from "preact/hooks";

interface CopiedModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export default function CopiedModal(
  { isOpen, setOpen }: CopiedModalProps,
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
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box justify-center text-center sm:max-w-sm">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm absolute top-2 right-2"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
          </div>
          <div className="flex size-35 items-center justify-center rounded-full bg-green-600/10 text-green-200">
            <ClipboardCheck
              strokeWidth={1.5}
              className="size-20 opacity-85"
            />
          </div>
          <h3 className="font-bold text-xl">Collage copied to clipboard</h3>
          <div className="flex w-full flex-col gap-4">
            <div>
              <p className="font-bold text-lg">
                This project is free and ad-free!
              </p>
              <p>If you can, support me to keep it online:</p>
            </div>
            <a
              className="btn btn-block flex items-center gap-2 border-indigo-600 bg-indigo-600 hover:bg-indigo-600/80 text-white"
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
        </div>
        <div className="divider" />

        <div className="flex w-full flex-col gap-4">
          <p className="">
            More projects and where to find me:
          </p>
          <a
            className="btn btn-block border-sky-600 bg-sky-600 hover:bg-sky-600/80"
            href="https://wfrancescons.gridme.bio/"
            target="_blank"
            rel="noopener"
          >
            <LayoutTemplate strokeWidth={2.5} className="h-4 w-4" />
            <span>Projects & Socials</span>
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
