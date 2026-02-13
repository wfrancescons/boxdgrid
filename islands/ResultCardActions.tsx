import { Check, Copy, Download } from "lucide-preact";
import { useState } from "preact/hooks";
import CopiedModal from "./modals/CopiedModal.tsx";
import DownloadModal from "./modals/DownloadModal.tsx";

interface ResultCardActionsProps {
  imageSrc: string;
}

export default function ResultCardActions({
  imageSrc,
}: ResultCardActionsProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function copyImageToClipboard() {
    if (copied) return;

    setCopied(true);

    const blob = await (await fetch(imageSrc)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);

    await sleep(1500);
    setCopyOpen(true);

    await sleep(300);
    setCopied(false);
  }

  async function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = imageSrc;
    link.click();
    await sleep(500);
    setDownloadOpen(true);
  }

  return (
    <div className="card-actions flex flex-col md:flex-row gap-2 justify-center items-center">
      <button
        type="button"
        className="btn btn-sm btn-soft gap-2 transition-all duration-500"
        onClick={copyImageToClipboard}
        disabled={copied}
      >
        {copied
          ? <Check strokeWidth={2.5} className="w-4 h-4" />
          : <Copy strokeWidth={2.5} className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy to Clipboard"}
      </button>

      <button
        type="button"
        className="btn btn-sm btn-soft gap-2"
        onClick={downloadCanvasImage}
      >
        <Download strokeWidth={2.5} className="w-4 h-4" />
        Download
      </button>
      <DownloadModal isOpen={downloadOpen} setOpen={setDownloadOpen} />
      <CopiedModal isOpen={copyOpen} setOpen={setCopyOpen} />
    </div>
  );
}
