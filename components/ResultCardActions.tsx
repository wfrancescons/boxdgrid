"use client";

import { Button } from "@heroui/react";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import SuccessModal from "./modals/SuccessModal";

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
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <Button
        variant="outline"
        size="sm"
        onPress={copyImageToClipboard}
        isDisabled={copied}
        data-umami-event="Copy button"
      >
        {copied ? (
          <Check strokeWidth={2.5} className="size-4" />
        ) : (
          <Copy strokeWidth={2.5} className="size-4" />
        )}
        {copied ? "Copied!" : "Copy"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onPress={downloadCanvasImage}
        data-umami-event="Download button"
      >
        <Download strokeWidth={2.5} className="size-4" />
        Download
      </Button>

      <SuccessModal
        type={modalType}
        isOpen={modalOpen}
        setOpen={setModalOpen}
      />
    </div>
  );
}
