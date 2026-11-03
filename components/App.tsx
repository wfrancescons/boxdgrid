"use client";

import { Card } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import LoadingFigure from "./figures/LoadingFigure";
import ResultFigure from "./figures/ResultFigure";
import WelcomeFigure from "./figures/WelcomeFigure";
import CollageForm from "./forms/CollageForm";
import ResultCardActions from "./ResultCardActions";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState({ rows: 0, cols: 0 });
  const [collage, setCollage] = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resultRef.current) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [collage]);

  return (
    <Card variant="default" className="min-h-0 w-full flex-1">
      <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-stretch justify-center gap-3 overflow-hidden md:flex-row">
        {/* Form */}
        <div className="mx-auto flex w-full shrink-0 flex-col items-center justify-center p-3 md:max-w-56">
          <CollageForm
            isLoading={isLoading}
            setLoading={setIsLoading}
            setSelectedGrid={setSelectedGrid}
            setCollage={setCollage}
          />
        </div>

        {/* Image Card */}
        <div
          className={`min-h-0 flex-1 md:relative md:flex ${
            collage ? "flex" : "hidden"
          }`}
        >
          <Card
            variant="secondary"
            className="min-h-0 w-full flex-1 md:absolute md:inset-0"
          >
            <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden">
              {!collage && !isLoading && <WelcomeFigure />}

              {isLoading && <LoadingFigure />}

              {collage && !isLoading && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-4">
                  <h2 className="shrink-0 font-bold">
                    {`Your ${selectedGrid.cols}x${selectedGrid.rows} collage:`}
                  </h2>

                  <div
                    ref={resultRef}
                    className="flex min-h-0 flex-1 items-center justify-center"
                  >
                    <ResultFigure src={collage} />
                  </div>

                  <div className="shrink-0">
                    <ResultCardActions imageSrc={collage} />
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </Card.Content>
    </Card>
  );
}
