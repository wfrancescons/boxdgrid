"use client";

import { buttonVariants, Link, Modal } from "@heroui/react";
import { HeartPlus } from "lucide-react";

interface SupportModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export default function SupportModal({ isOpen, setOpen }: SupportModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <Modal.Backdrop variant="blur" isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Container placement="center" size="xs">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header className="items-center text-center">
              <Modal.Icon className="bg-warning-soft text-warning-soft-foreground">
                <HeartPlus strokeWidth={2} className="size-6" />
              </Modal.Icon>
              <Modal.Heading>Support This Project</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="flex flex-col items-center gap-4 text-center">
              <p className="text-muted text-sm">
                If you’d like to contribute, you can choose one of the options
                below:
              </p>
              <div className="flex w-full flex-col gap-3">
                <Link
                  href="https://livepix.gg/wfrancescons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    fullWidth: true,
                  })}
                  data-umami-event="outbound-link-click"
                  data-umami-event-url="https://livepix.gg/wfrancescons"
                >
                  <img
                    src="https://static.livepix.gg/favicon-32x32.png"
                    alt="Live Pix"
                    className="inline-block w-4"
                  />
                  Pix (LivePix)
                </Link>
                <Link
                  href="https://ko-fi.com/wfrancescons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "secondary",
                    fullWidth: true,
                  })}
                  data-umami-event="outbound-link-click"
                  data-umami-event-url="https://ko-fi.com/wfrancescons"
                >
                  <img
                    src="https://storage.ko-fi.com/cdn/cup-border.png"
                    alt="Ko-fi"
                    className="inline-block w-4"
                  />
                  Credit Card (Ko-fi)
                </Link>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
