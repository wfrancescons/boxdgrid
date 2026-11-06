"use client";

import { Button } from "@heroui/react";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      Boolean(navigator.canShare),
    );
  }, []);

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

  async function shareImage() {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], "letterboxd-collage.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Letterboxd Collage",
          text: "Created with boxdgrid.com",
        });
      } else {
        await copyImageToClipboard();
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Share failed:", err);
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {canShare && (
        <Button
          variant="outline"
          size="sm"
          onPress={shareImage}
          data-umami-event="Share button"
        >
          <Share2 strokeWidth={2.5} className="size-4" />
          Share
        </Button>
      )}

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
