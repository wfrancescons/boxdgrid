import { useComputed, useSignal } from "@preact/signals";
import { useRef, useState } from "preact/hooks";
import renderCanvas from "../utils/render.ts";
import gridlbTemplate from "../utils/template.ts";
import GridPicker from "./GridPicker.tsx";

export default function App() {
  const letterboxdUsername = useSignal("");
  const showTitlesAndRating = useSignal(true);
  const grid = useSignal({ rows: 0, cols: 0 });

  const isLoading = useSignal(false);
  const hasImage = useSignal(false);
  const [collage, setCollage] = useState(
    "/home-grid.png",
  );
  const [apiError, setApiError] = useState("");

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

      setApiError("");

      try {
        const param = showTitlesAndRating.value ? null : "notexts";

        const res = await fetch(
          `/api/letterboxd/${letterboxdUsername.value}?limit=${
            grid.value.rows * grid.value.cols
          }`,
        );

        if (res.status === 404) {
          setApiError("Username not found.");
          return;
        }

        if (res.status === 204) {
          setApiError("No diary entries found.");
          return;
        }

        if (!res.ok) {
          setApiError("Something went wrong.");
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
        setCollage(image);

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
    link.href = collage;
    link.click();
    setTimeout(() => {
      openModal();
    }, 700);
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg">
        {/* Navbar */}
        <nav className="navbar flex-none w-full justify-center items-center">
          <div className="navbar-center max-w-6xl flex items-center pt-5 pb-2">
            <img
              src="/boxdgrid-logo.png"
              alt="BoxdGrid Logo"
              className="w-full max-w-40"
            />
          </div>
        </nav>

        {/* Subtitle */}
        <div className="text-sm px-20 flex justify-center items-center text-center">
          Create grid-style collages of your latest Letterboxd watches
        </div>

        {/* Conteúdo principal - CORRIGIDO: container centralizado */}
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
                        apiError ? "input-error" : ""
                      } flex max-w-none items-center gap-2`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        class="h-3 w-3 opacity-70 fill-current"
                      >
                        <path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z" />
                      </svg>
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

                    {apiError && (
                      <div className="label flex-none">
                        <span className="label-text-alt text-error md:text-xs">
                          {apiError}
                        </span>
                      </div>
                    )}
                  </div>
                  <GridPicker grid={grid} />
                  <label class="text-base-content/60 flex items-center gap-2 md:text-xs">
                    <input
                      type="checkbox"
                      class="toggle toggle-primary md:toggle-xs"
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
                          class="btn btn-primary btn-block md:btn-sm"
                          disabled
                        >
                          <span class="loading loading-spinner loading-xs" />
                          Generating…
                        </button>
                      )
                      : (
                        <button
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

            {/* Imagem em card separado no mobile (sm:hidden) */}
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
                          src={collage}
                          alt="Collage"
                          className="rounded-md w-auto h-auto max-h-[65vh] object-contain"
                        />
                      )}
                  </figure>

                  {hasImage.value
                    ? (
                      <div className="card-actions">
                        <button
                          className="btn btn-outline md:btn-sm"
                          onClick={downloadCanvasImage}
                          data-umami-event="Download button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                            fill="currentColor"
                            class="h-3 w-3 fill-current"
                          >
                            <path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                          </svg>
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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
              className="fill-current"
            >
              <path d="M256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM371 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.2 .5-37.1 23.5-104.6 69.1-9.9 6.8-18.9 10.1-26.9 9.9-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3 .6-4.5 6.7-9 18.4-13.7 72.3-31.5 120.5-52.3 144.6-62.3 68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9 2 1.7 3.2 4.1 3.5 6.7 .5 3.2 .6 6.5 .4 9.8z" />
            </svg>
            t.me/letterboxdgram
          </a>
          <div className="divider" />
          <p className="pb-4">
            Enjoying boxdgrid? Support the project and help keep it online:
          </p>
          <a
            className="btn btn-block bg-indigo-400 text-white border-indigo-400 flex items-center gap-2"
            href="https://ko-fi.com/wfrancescons"
            target="_blank"
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

      {/* Footer — aparece apenas com rolagem */}
      <footer className="footer md:footer-horizontal bg-base-300 text-neutral-content items-center py-2 md:py-4">
        <div className="w-full max-w-3xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <aside className="flex flex-col items-center md:items-start gap-1 text-base-content">
            <span>
              © {new Date().getFullYear()} -{" "}
              <a
                className="link link-hover font-semibold p-0 m-0"
                href="https://bento.me/wfrancescons"
                target="_blank"
              >
                Wesley Francescon
              </a>
            </span>
            <span className="text-xs text-base-content/60">
              This project is not associated with Letterboxd.
            </span>
          </aside>
          <nav className="flex gap-4">
            <div className="grid grid-flow-col gap-4">
              <a href="https://t.me/letterboxdgrambot" target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                  className="fill-current"
                >
                  <path d="M256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM371 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.2 .5-37.1 23.5-104.6 69.1-9.9 6.8-18.9 10.1-26.9 9.9-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3 .6-4.5 6.7-9 18.4-13.7 72.3-31.5 120.5-52.3 144.6-62.3 68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9 2 1.7 3.2 4.1 3.5 6.7 .5 3.2 .6 6.5 .4 9.8z" />
                </svg>
              </a>
              <a
                href="https://github.com/wfrancescons"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                  className="fill-current"
                >
                  <path d="M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </footer>
    </>
  );
}
