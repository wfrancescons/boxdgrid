"use client";

import {
  Button,
  buttonVariants,
  Link,
  Modal,
  Separator,
} from "@heroui/react";
import { ClipboardCheck, FileDown, HeartPlus } from "lucide-react";
import { useState } from "react";

import SupportModal from "./SupportModal";

interface SuccessModalProps {
  isOpen: boolean;
  type: "copy" | "download";
  setOpen: (value: boolean) => void;
}

export default function SuccessModal({
  isOpen,
  setOpen,
  type,
}: SuccessModalProps) {
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const dialogGradients = {
    copy: "bg-radial-[at_50%_0%] from-green-500/12 via-transparent to-transparent",
    download: "bg-radial-[at_50%_0%] from-cyan-500/12 via-transparent to-transparent",
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={setOpen}>
          <Modal.Container placement="center" size="sm">
            <Modal.Dialog className={`overflow-hidden ${dialogGradients[type]}`}>
              <Modal.CloseTrigger />
              <Modal.Header className="items-center text-center">
                {type === "copy" ? (
                  <>
                    <Modal.Icon className="bg-success-soft text-success-soft-foreground">
                      <ClipboardCheck strokeWidth={2} className="size-6" />
                    </Modal.Icon>
                    <Modal.Heading>Collage copied to clipboard</Modal.Heading>
                  </>
                ) : (
                  <>
                    <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                      <FileDown strokeWidth={2} className="size-6" />
                    </Modal.Icon>
                    <Modal.Heading>Your download is ready</Modal.Heading>
                  </>
                )}
              </Modal.Header>

              <Modal.Body className="flex flex-col items-center gap-4 text-center">
                <div className="w-full rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3.5 flex flex-col items-center gap-3 text-center">
                  <div>
                    <p className="font-bold text-foreground">
                      This project is free and ad-free!
                    </p>
                    <p className="text-muted text-sm">
                      If you can, support me to keep it online:
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    className="bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow-xs"
                    onPress={() => {
                      setSupportModalOpen(true);
                    }}
                  >
                    <HeartPlus strokeWidth={3} className="size-4" />
                    Support this project
                  </Button>
                </div>

                <div className="flex w-full flex-col items-center gap-2">
                  <p className="text-muted text-sm">
                    Get more out of boxdgrid on Telegram:
                  </p>
                  <Link
                    href="https://t.me/letterboxdgrambot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonVariants({
                      fullWidth: true,
                    })} flex items-center justify-center gap-2.5 border border-sky-500/30 bg-sky-500/15 hover:bg-sky-500/25 transition-colors`}
                    data-umami-event="outbound-link-click"
                    data-umami-event-url="https://t.me/letterboxdgrambot"
                  >
                    <img
                      src="https://telegram.org/img/WidgetButton_LogoLarge.png"
                      alt="Telegram logo"
                      className="inline-block w-5 shrink-0"
                    />
                    <span>t.me/letterboxdgrambot</span>
                  </Link>
                </div>

                <Separator />

                <div className="flex w-full flex-col items-center gap-2">
                  <p className="text-muted text-sm">
                    More projects and where to find me:
                  </p>
                  <Link
                    href="https://wfrancescons.gridme.bio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${buttonVariants({
                      variant: "secondary",
                      fullWidth: true,
                    })} flex items-center justify-center gap-2 transition-colors hover:border-foreground/20`}
                    data-umami-event="outbound-link-click"
                    data-umami-event-url="https://wfrancescons.gridme.bio/"
                  >
                    Projects & Socials
                  </Link>
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <SupportModal
        isOpen={supportModalOpen}
        setOpen={setSupportModalOpen}
      />
    </>
  );
}
