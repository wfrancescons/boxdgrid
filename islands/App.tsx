import { Signal, useComputed, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";

import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import DownloadIcon from "../components/icons/DownloadIcon.tsx";
import TelegramIcon from "../components/icons/TelegramIcon.tsx";
import UserIcon from "../components/icons/UserIcon.tsx";
import renderCanvas from "../utils/render.ts";
import gridlbTemplate from "../utils/template.ts";
import GridPicker from "./GridPicker.tsx";

export default function App() {
  const letterboxdUsername = useSignal("");
  const showTitlesAndRating = useSignal(true);
  const grid = useSignal({ rows: 0, cols: 0 });

  const isLoading = useSignal(false);
  const hasImage = useSignal(false);
  const collage: Signal<string | undefined> = useSignal(
    "/home-grid.png",
  );
  const apiError = useSignal("");

  const canGenerate = useComputed(() =>
    letterboxdUsername.value !== "" &&
    grid.value.rows > 0 &&
    grid.value.cols > 0
  );

  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };

  function generateCollage() {
    return async () => {
      isLoading.value = true;
      hasImage.value = false;

      apiError.value = "";

      try {
        const param = showTitlesAndRating.value ? null : "notexts";

        const res = await fetch(
          `/api/letterboxd/${letterboxdUsername.value}?limit=${
            grid.value.rows * grid.value.cols
          }`,
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
          columns: grid.value.cols,
          rows: grid.value.rows,
          param,
        });

        const image = await renderCanvas(letterboxdTemplate);
        collage.value = image;

        hasImage.value = true;

        if (globalThis.innerWidth < 768) {
          setTimeout(() => {
            const imgCard = document.querySelector(".card-body img");
            if (imgCard) {
              imgCard.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 100);
        }
      } catch (err) {
        console.error("Erro ao gerar imagem:", err);
      } finally {
        isLoading.value = false;
      }
    };
  }

  function downloadCanvasImage() {
    const link = document.createElement("a");
    link.download = "letterboxd-collage.png";
    link.href = collage.value;
    link.click();
    setTimeout(() => {
      openModal();
    }, 700);
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
                        onChange={(
                          e,
                        ) => (letterboxdUsername.value = e.target.value.trim())}
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
                          onClick={generateCollage()}
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
                          src={collage.value}
                          alt="Collage"
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
            Enjoying it? Support the project and help keep it online:
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
            Support me on Ko-fi
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
