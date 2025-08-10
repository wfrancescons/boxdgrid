import { Signal, useComputed, useSignal } from "@preact/signals";
import { JSX } from "preact";
import { useRef } from "preact/hooks";

import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import DownloadIcon from "../components/icons/DownloadIcon.tsx";
import TelegramIcon from "../components/icons/TelegramIcon.tsx";
import UserIcon from "../components/icons/UserIcon.tsx";
import renderCanvas from "../utils/render.ts";
import gridlbTemplate from "../utils/template.ts";
import GridPicker from "./GridPicker.tsx";

type Grid = { rows: number; cols: number };

export default function App() {
  const letterboxdUsername = useSignal<string>("");
  const showTitlesAndRating = useSignal<boolean>(true);
  const grid = useSignal<Grid>({ rows: 0, cols: 0 });
  const isLoading = useSignal<boolean>(false);
  const hasImage = useSignal<boolean>(false);
  const collage: Signal<string | undefined> = useSignal("/home-grid.webp");
  const apiError = useSignal<string>("");

  const canGenerate = useComputed(() =>
    letterboxdUsername.value !== "" &&
    grid.value.rows > 0 &&
    grid.value.cols > 0
  );

  const modalRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const openModal = () => modalRef.current?.showModal();

  const scrollToImage = () => {
    queueMicrotask(() => {
      imageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  async function generateCollage() {
    isLoading.value = true;
    hasImage.value = false;
    apiError.value = "";

    const columns = grid.value.cols;
    const rows = grid.value.rows;

    try {
      const param = showTitlesAndRating.value ? null : "notexts";

      const res = await fetch(
        `/api/letterboxd/${letterboxdUsername.value}?limit=${columns * rows}`,
      );

      if (res.status === 404) {
        apiError.value = "Username not found.";
        return;
      }

      if (res.status === 204) {
        apiError.value = "No diary entries found.";
        return;
      }

      if (!res.ok) {
        apiError.value = "Something went wrong.";
        throw new Error(`Error: ${res.status}`);
      }

      const lastFilms = await res.json();

      const letterboxdTemplate = gridlbTemplate({
        lastFilms,
        columns,
        rows,
        param,
      });

      const image = await renderCanvas(letterboxdTemplate);
      collage.value = image;

      hasImage.value = true;

      if (globalThis.innerWidth < 768) scrollToImage();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      isLoading.value = false;
    }
  }

  function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = collage.value!;
    link.click();
    setTimeout(() => {
      openModal();
    }, 700);
  }

  function saveUsername(e: JSX.TargetedEvent<HTMLInputElement, Event>) {
    letterboxdUsername.value = e.currentTarget.value.trim();
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg">
        <Header />

        <main className="flex-1 flex items-center justify-center w-full p-6 md:p-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-6xl w-full">
            <div className="card bg-base-300 shadow-sm">
              <div className="card-body">
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div class="flex items-center gap-2 md:text-sm font-medium">
                    Create your collage
                  </div>
                  <div class="flex flex-col gap-1">
                    <label
                      class={`input md:input-sm input-border ${
                        apiError.value ? "input-error" : ""
                      } flex max-w-none items-center gap-2`}
                    >
                      <UserIcon className="h-3 w-3 opacity-70 fill-current" />
                      <input
                        type="text"
                        class="grow"
                        name="letterboxd-username"
                        placeholder="Letterboxd username"
                        onChange={saveUsername}
                      />
                    </label>

                    {apiError.value && (
                      <div className="label flex-none">
                        <span className="label-text-alt text-error md:text-xs">
                          {apiError.value}
                        </span>
                      </div>
                    )}
                  </div>
                  <GridPicker grid={grid} />
                  <label class="text-base-content/60 flex items-center gap-2 md:text-xs">
                    <input
                      type="checkbox"
                      class="toggle toggle-sm toggle-primary md:toggle-xs"
                      onChange={() => {
                        showTitlesAndRating.value = !showTitlesAndRating.value;
                      }}
                      defaultChecked
                    />
                    Show titles and rating
                  </label>
                  <div class="card-actions items-center gap-6">
                    {isLoading.value
                      ? (
                        <button
                          type="button"
                          class="btn btn-primary btn-block md:btn-sm"
                          disabled
                        >
                          <span class="loading loading-spinner loading-xs" />
                          Generating…
                        </button>
                      )
                      : (
                        <button
                          type="button"
                          class="btn btn-primary btn-block md:btn-sm"
                          onClick={generateCollage}
                          disabled={!canGenerate.value}
                          data-umami-event="Generate button"
                        >
                          Generate Collage
                        </button>
                      )}
                  </div>
                </form>
              </div>
            </div>

            <div
              className={`md:flex w-full max-w-lg ${
                hasImage.value ? "flex" : "hidden"
              }`}
            >
              <div className="card w-full bg-base-300 shadow-sm">
                <div className="card-body items-center justify-center text-center overflow-hidden">
                  <figure className="w-full">
                    {isLoading.value
                      ? (
                        <div class="skeleton w-full max-h-[65vh] h-[50vh] rounded-md bg-base-200" />
                      )
                      : (
                        <img
                          ref={imageRef}
                          src={collage.value}
                          alt="Letterboxd collage"
                          className="rounded-md w-auto h-auto max-h-[65vh] object-contain pointer-events-none"
                        />
                      )}
                  </figure>

                  {hasImage.value
                    ? (
                      <div className="card-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={downloadCanvasImage}
                          data-umami-event="Download button"
                        >
                          <DownloadIcon className="fill-current w-3 h-3" />
                          Download
                        </button>
                      </div>
                    )
                    : ("")}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box sm:max-w-sm">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-xl">Your download is ready! 🎉</h3>
          <p className="py-4">
            Get more out of boxdgrid on Telegram:
          </p>
          <a
            className="btn btn-block bg-sky-600 text-white border-sky-600"
            href="https://t.me/letterboxdgrambot"
            target="_blank"
            rel="noopener"
          >
            <TelegramIcon className="fill-current w-4 h-4" />
            t.me/letterboxdgram
          </a>
          <div className="divider" />
          <p className="pb-4">
            <span className="font-bold">This project is free and ad-free!</span>
            {"  "}If you can, support boxdgrid to help keep it online:
          </p>
          <a
            className="btn btn-block bg-indigo-400 text-white border-indigo-400 flex items-center gap-2"
            href="https://ko-fi.com/wfrancescons"
            target="_blank"
            rel="noopener"
          >
            <img
              src="https://storage.ko-fi.com/cdn/cup-border.png"
              alt="Ko-fi"
              className="inline-block h-4 w-5"
            />
            Support on Ko-fi
          </a>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <Footer />
    </>
  );
}
