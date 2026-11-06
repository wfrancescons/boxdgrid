"use client";

import { Button, Link, Separator } from "@heroui/react";
import { HeartPlus } from "lucide-react";
import { useState } from "react";
import GithubIcon from "@/components/icons/GithubIcon";
import TelegramIcon from "@/components/icons/TelegramIcon";

import SupportModal from "./modals/SupportModal";

export default function Footer() {
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  return (
    <footer className="w-full bg-surface/30 py-2 md:py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 p-4 md:flex-row">
        <aside className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-sm">
            © {new Date().getFullYear()} -{" "}
            <Link
              href="https://wfrancescons.gridme.bio/"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="outbound-link-click"
              data-umami-event-url="https://wfrancescons.gridme.bio/"
            >
              Wesley Francescon
            </Link>
          </span>
          <span className="text-muted text-xs">
            This project is not associated with Letterboxd.
          </span>
        </aside>
        <nav className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onPress={() => setSupportModalOpen(true)}
          >
            <HeartPlus strokeWidth={3} className="size-4" />
            Support this project
          </Button>
          <SupportModal
            isOpen={supportModalOpen}
            setOpen={setSupportModalOpen}
          />
          <Separator orientation="vertical" className="h-6" />
          <div className="grid grid-flow-col gap-4">
            <Link
              href="https://t.me/letterboxdgrambot"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open letterboxdgram on Telegram"
              className="opacity-70 hover:opacity-100 transition-opacity"
              data-umami-event="outbound-link-click"
              data-umami-event-url="https://t.me/letterboxdgrambot"
            >
              <TelegramIcon className="h-6 w-6 fill-current" />
            </Link>
            <Link
              href="https://github.com/wfrancescons/boxdgrid"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit my GitHub profile"
              className="opacity-70 hover:opacity-100 transition-opacity"
              data-umami-event="outbound-link-click"
              data-umami-event-url="https://github.com/wfrancescons/boxdgrid"
            >
              <GithubIcon className="h-6 w-6 fill-current" />
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
