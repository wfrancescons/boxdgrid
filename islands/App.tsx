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
    <div className="flex min-h-0 w-full flex-col items-stretch justify-center gap-3 overflow-hidden rounded-3xl bg-base-300/50 p-3 shadow-sm drop-shadow-2xl md:flex-row">
      {/* Form */}
      <div className="mx-auto flex w-full flex-col shrink-0 items-center justify-center p-3 md:max-w-50">
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
          className={`flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl bg-base-100/75 p-3 md:absolute md:inset-0`}
        >
          {!collage && !isLoading && <WelcomeFigure />}

          {isLoading && <LoadingFigure />}

          {collage && !isLoading && (
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-4 overflow-hidden">
              <h2 className="shrink-0 font-bold">
                {`Your ${selectedGrid.cols}x${selectedGrid.rows} collage:`}
              </h2>

              <div
                ref={resultRef}
                className="flex min-h-0 w-full flex-1 items-center justify-center"
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
