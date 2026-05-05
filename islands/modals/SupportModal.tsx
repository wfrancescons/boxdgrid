import { HeartPlus } from "lucide-preact";
import { useEffect, useRef } from "preact/hooks";

interface SupportModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export default function SupportModal(
  { isOpen, setOpen }: SupportModalProps,
) {
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

  return (
    <dialog
      ref={dialogRef}
      className="md:modal-middle modal modal-bottom"
      onClose={() => setOpen(false)}
      onCancel={() => setOpen(false)}
    >
      <div className="modal-box justify-center bg-radial-[at_50%_10%] from-yellow-500/15 to-75% to-base-100 text-center sm:max-w-xs">
        <button
          type="button"
          className="btn btn-circle btn-ghost absolute top-2 right-2"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex size-20 items-center justify-center rounded-full bg-yellow-600/10 text-yellow-200">
              <HeartPlus
                strokeWidth={2}
                className="size-12 opacity-85"
              />
            </div>
            <span className="font-bold text-xl">
              Support This Project
            </span>
            <p className="opacity-75">
              If you’d like to contribute, you can choose one of the options
              below:
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <a
              className="btn btn-wide flex items-center gap-2 border-0 bg-teal-600/20 hover:bg-teal-600/90"
              href="https://livepix.gg/wfrancescons"
              target="_blank"
            >
              <img
                src="https://static.livepix.gg/favicon-32x32.png"
                alt="Ko-fi"
                className="inline-block w-4"
              />
              Pix (LivePix)
            </a>
            <a
              className="btn btn-soft btn-wide border-0 bg-indigo-600/20 hover:bg-indigo-600/90"
              href="https://ko-fi.com/wfrancescons"
              target="_blank"
            >
              <img
                src="https://storage.ko-fi.com/cdn/cup-border.png"
                alt="Ko-fi"
                className="inline-block w-4"
              />
              Credit Card (Ko-fi)
            </a>
          </div>
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
