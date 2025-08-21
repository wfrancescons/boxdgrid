import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";

// Components
import LoadingFigure from "../components/figures/LoadingFigure.tsx";
import ResultFigure from "../components/figures/ResultFigure.tsx";
import WelcomeFigure from "../components/figures/WelcomeFigure.tsx";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

// Islands
import CollageForm from "./forms/CollageForm.tsx";
import CopiedModal from "./modals/CopiedModal.tsx";
import DownloadModal from "./modals/DownloadModal.tsx";
import ResultCardActions from "./ResultCardActions.tsx";

export default function App() {
  const isLoading = useSignal<boolean>(false);
  const hasImage = useSignal<boolean>(false);
  const collage = useSignal<string>("");

  const downloadModalToggle = useSignal<boolean>(false);
  const copiedModalToggle = useSignal<boolean>(false);

  const resultRef = useRef<HTMLImageElement>(null);

  function scrollToImage() {
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  const formSignals = {
    isLoading,
    collage,
    hasImage,
    scrollToImage,
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg">
        <Header />

        <main className="flex-1 flex items-center justify-center w-full p-6 md:p-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-6xl w-full">
            {/* Form Card */}
            <div className="card bg-base-300 shadow-sm">
              <CollageForm {...formSignals} />
            </div>

            {/* Image Card */}
            <div
              className={`md:flex w-full max-w-lg ${
                collage.value ? "flex" : "hidden"
              }`}
            >
              <div className="card w-full bg-base-300 shadow-sm">
                <div
                  className="card-body items-center justify-center text-center overflow-hidden"
                  ref={resultRef}
                >
                  {!hasImage.value && !isLoading.value && <WelcomeFigure />}

                  {isLoading.value && <LoadingFigure />}

                  {hasImage.value && !isLoading.value && collage.value && (
                    <>
                      <h2 className="font-medium text-base">
                        Your collage:
                      </h2>
                      <ResultFigure src={collage} />

                      <ResultCardActions
                        imageSrc={collage}
                        modals={{
                          download: downloadModalToggle,
                          copied: copiedModalToggle,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <DownloadModal toggle={downloadModalToggle} />
      <CopiedModal toggle={copiedModalToggle} />
      <Footer />
    </>
  );
}
