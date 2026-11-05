"use client";

import { Card } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import LoadingFigure from "./figures/LoadingFigure";
import ResultFigure from "./figures/ResultFigure";
import WelcomeFigure from "./figures/WelcomeFigure";
import CollageForm, { type Grid } from "./forms/CollageForm";
import ResultCardActions from "./ResultCardActions";
import DisplayOptions from "./DisplayOptions";
import { useLetterboxd } from "@/hooks/useLetterboxd";
import { useCollageRenderer } from "@/hooks/useCollageRenderer";

interface QueryParams {
  username: string;
  limit: number;
  period: string;
}

export default function App() {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    username: "",
    limit: 0,
    period: "all",
  });
  const [selectedGrid, setSelectedGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [showTitles, setShowTitles] = useState<boolean>(true);
  const [showRatings, setShowRatings] = useState<boolean>(true);

  const resultRef = useRef<HTMLDivElement>(null);

  // Fetch Letterboxd films with smart quantity caching & 1-minute TTL
  const {
    films,
    isLoading: isFetching,
    error: apiError,
  } = useLetterboxd({
    username: queryParams.username,
    limit: queryParams.limit,
    period: queryParams.period,
    enabled: Boolean(queryParams.username && queryParams.limit > 0),
  });

  // Render collage canvas reactively when display options change
  const {
    collage,
    isRendering,
    renderError,
  } = useCollageRenderer({
    films,
    grid: selectedGrid,
    showTitles,
    showRatings,
  });

  // Form loading state is true when fetching or when generating the initial collage
  const isFormLoading = isFetching || (!collage && isRendering);
  const errorMessage = apiError || renderError;

  useEffect(() => {
    if (!resultRef.current || !collage) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [collage]);

  function handleGenerate({
    username,
    grid,
    period,
  }: {
    username: string;
    grid: Grid;
    period: string;
  }) {
    setSelectedGrid(grid);
    setQueryParams({
      username,
      limit: grid.rows * grid.cols,
      period,
    });
  }

  return (
    <Card variant="default" className="min-h-0 w-full flex-1">
      <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-stretch justify-center gap-3 overflow-hidden md:flex-row">
        {/* Minimalist Form */}
        <div className="mx-auto flex w-full shrink-0 flex-col items-center justify-center p-3 md:max-w-56">
          <CollageForm
            isLoading={isFormLoading}
            errorMessage={errorMessage}
            onGenerate={handleGenerate}
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
            <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden p-3">
              {!collage && !isFetching && <WelcomeFigure />}

              {isFetching && <LoadingFigure />}

              {collage && !isFetching && (
                <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-3">
                  {/* Top Control Bar: Title & Overlays Popover */}
                  <div className="flex w-full shrink-0 items-center justify-between px-1">
                    <h2 className="font-bold text-sm md:text-base">
                      {`Your ${selectedGrid.cols}x${selectedGrid.rows} collage:`}
                    </h2>
                    <DisplayOptions
                      showTitles={showTitles}
                      setShowTitles={setShowTitles}
                      showRatings={showRatings}
                      setShowRatings={setShowRatings}
                    />
                  </div>

                  {/* Canvas Output (keeps mounted, smooth update when isRendering) */}
                  <div
                    ref={resultRef}
                    className={`flex min-h-0 flex-1 items-center justify-center transition-opacity duration-200 ${
                      isRendering ? "opacity-75" : "opacity-100"
                    }`}
                  >
                    <ResultFigure src={collage} />
                  </div>

                  {/* Bottom Export Actions (Copy / Download) */}
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
