import { Check, Copy, Download } from "lucide-preact";
import { useState } from "preact/hooks";

interface ResultCardActionsProps {
  imageSrc: string;
}

export default function ResultCardActions({
  imageSrc,
}: ResultCardActionsProps) {
  const [copied, setCopied] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function copyImageToClipboard() {
    if (copied) return;

    setCopied(true);

    const blob = await (await fetch(imageSrc)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);

    await sleep(1500);
    // onCopy();

    await sleep(300);
    setCopied(false);
  }

  function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = imageSrc;
    link.click();

    // onDownload();
  }

  return (
    <div className="card-actions flex gap-2">
      <button
        type="button"
        className="btn btn-sm btn-outline gap-2 transition-all duration-300"
        onClick={copyImageToClipboard}
        disabled={copied}
      >
        {copied
          ? <Check strokeWidth={2.5} className="w-4 h-4" />
          : <Copy strokeWidth={2.5} className="w-4 h-4" />}
        <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
      </button>

      <button
        type="button"
        className="btn btn-sm btn-outline gap-2"
        onClick={downloadCanvasImage}
      >
        <Download strokeWidth={2.5} className="w-4 h-4" />
        <span>Download</span>
      </button>
    </div>
  );
}
