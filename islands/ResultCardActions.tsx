import { Check, Copy, Download } from "lucide-preact";
import { useState } from "preact/hooks";
import SuccessModal from "./modals/SuccessModal.tsx";

interface ResultCardActionsProps {
  imageSrc: string;
}

export default function ResultCardActions({
  imageSrc,
}: ResultCardActionsProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"copy" | "download">("copy");
  const [modalOpen, setModalOpen] = useState(false);

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function copyImageToClipboard() {
    if (copied) return;

    setCopied(true);

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);

      await sleep(1500);
      setModalType("copy");
      setModalOpen(true);

      await sleep(300);
    } catch (err) {
      console.error("Copy failed:", err);
    } finally {
      setCopied(false);
    }
  }

  async function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = imageSrc;
    link.click();
    await sleep(500);
    setModalType("download");
    setModalOpen(true);
  }

  return (
    <div className="card-actions flex flex-col items-center justify-center gap-2 md:flex-row">
      <button
        type="button"
        className="btn btn-sm btn-soft gap-2 transition-all duration-500"
        onClick={copyImageToClipboard}
        disabled={copied}
        data-umami-event="Copy button"
      >
        {copied
          ? <Check strokeWidth={2.5} className="h-4 w-4" />
          : <Copy strokeWidth={2.5} className="h-4 w-4" />}
        {copied ? "Copied!" : "Copy"}
      </button>

      <button
        type="button"
        className="btn btn-sm btn-soft gap-2"
        onClick={downloadCanvasImage}
        data-umami-event="Download button"
      >
        <Download strokeWidth={2.5} className="h-4 w-4" />
        Download
      </button>
      <SuccessModal
        type={modalType}
        isOpen={modalOpen}
        setOpen={setModalOpen}
      />
    </div>
  );
}
