import { useEffect, useRef, useState } from "preact/hooks";

import LoadingFigure from "../components/figures/LoadingFigure.tsx";
import ResultFigure from "../components/figures/ResultFigure.tsx";
import WelcomeFigure from "../components/figures/WelcomeFigure.tsx";
import CollageForm from "./forms/CollageForm.tsx";
import ResultCardActions from "./ResultCardActions.tsx";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState({ rows: 0, cols: 0 });
  const [collage, setCollage] = useState("");

  const resultRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!resultRef.current) return;

    const isMobile = globalThis.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [collage]);

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center bg-base-300/50 shadow-sm w-full rounded-3xl drop-shadow-2xl overflow-hidden p-3 gap-3 min-h-0">
      {/* Form */}
      <div className="flex flex-col w-full md:max-w-50 shrink-0 p-3 items-center justify-center mx-auto">
        <CollageForm
          isLoading={isLoading}
          setLoading={setIsLoading}
          setSelectedGrid={setSelectedGrid}
          setCollage={setCollage}
        />
      </div>

      {/* Image Card */}
      <div
        className={`flex-1 md:flex ${
          collage ? "flex" : "hidden"
        } min-h-0 md:relative`}
      >
        <div
          className={`md:absolute md:inset-0 flex flex-1 flex-col w-full bg-base-100/75 rounded-2xl items-center justify-center p-3 min-h-0 overflow-hidden`}
        >
          {!collage && !isLoading && <WelcomeFigure />}

          {isLoading && <LoadingFigure />}

          {collage && !isLoading && (
            <div className="flex flex-1 flex-col items-center justify-between gap-4 w-full min-h-0 overflow-hidden">
              <h2 className="font-bold shrink-0">
                {`Your ${selectedGrid.cols}x${selectedGrid.rows} collage:`}
              </h2>

              <div
                ref={resultRef}
                className="flex-1 flex items-center justify-center w-full min-h-0"
              >
                <ResultFigure src={collage} />
              </div>

              <div className="shrink-0">
                <ResultCardActions imageSrc={collage} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
