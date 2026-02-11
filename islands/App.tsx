import { useEffect, useRef, useState } from "preact/hooks";

// Components
import LoadingFigure from "../components/figures/LoadingFigure.tsx";
import ResultFigure from "../components/figures/ResultFigure.tsx";
import WelcomeFigure from "../components/figures/WelcomeFigure.tsx";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

// Islands
import CollageForm from "./forms/CollageForm.tsx";
import ResultCardActions from "./ResultCardActions.tsx";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [collage, setCollage] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);
  const resultFigureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collage) return;

    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [collage]);

  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg">
        <Header />

        <main className="flex-1 flex items-center justify-center w-full p-6 md:p-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-6xl w-full">
            {/* Form Card */}
            <div className="card bg-base-300 shadow-sm">
              <CollageForm
                isLoading={isLoading}
                setLoading={setIsLoading}
                setCollage={setCollage}
              />
            </div>

            {/* Image Card */}
            <div
              className={`md:flex w-full max-w-lg ${
                collage ? "flex" : "hidden"
              }`}
            >
              <div className="card w-full bg-base-300 shadow-sm">
                <div
                  className="card-body items-center justify-center text-center overflow-hidden"
                  ref={resultRef}
                >
                  {!collage && !isLoading && <WelcomeFigure />}

                  {isLoading && <LoadingFigure />}

                  {collage && !isLoading && (
                    <>
                      <h2 className="font-medium text-base">
                        Your collage:
                      </h2>

                      <div ref={resultFigureRef}>
                        <ResultFigure src={collage} />
                      </div>

                      <ResultCardActions imageSrc={collage} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
