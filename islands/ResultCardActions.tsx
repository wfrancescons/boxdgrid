import { Signal, useSignal } from "@preact/signals";

import CopiedIcon from "../components/icons/CopiedIcon.tsx";
import CopyIcon from "../components/icons/CopyIcon.tsx";
import DownloadIcon from "../components/icons/DownloadIcon.tsx";

interface ResultCardActionsProps {
  imageSrc: Signal<string>;
  modalToggle: Signal<boolean>;
}

export default function ResultCardActions(
  { imageSrc, modalToggle }: ResultCardActionsProps,
) {
  const isCopied = useSignal<boolean>(false);

  function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = imageSrc.value!;
    link.click();
    setTimeout(() => {
      modalToggle.value = true;
    }, 700);
  }

  async function copyImageToClipboard() {
    isCopied.value = true;

    const res = await fetch(imageSrc.value);
    const blob = await res.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);

    setTimeout(() => {
      isCopied.value = false;
    }, 1500);
  }

  return (
    <div className="card-actions flex flex-row gap-2">
      <button
        type="button"
        className="btn btn-sm btn-outline"
        onClick={downloadCanvasImage}
        data-umami-event="Download button"
      >
        <DownloadIcon className="fill-current w-3 h-3" />
        Download
      </button>
      <button
        type="button"
        className="btn btn-sm btn-outline"
        onClick={copyImageToClipboard}
        data-umami-event="Copy button"
      >
        {!isCopied.value
          ? (
            <>
              <CopyIcon className="fill-current w-3 h-3" />
              <span>Copy to Clipboard</span>
            </>
          )
          : (
            <>
              <CopiedIcon className="fill-current w-3 h-3" />
              <span>Copied!</span>
            </>
          )}
      </button>
    </div>
  );
}
