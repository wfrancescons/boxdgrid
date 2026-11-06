"use client";

import { Card, Drawer, useMediaQuery } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [queryParams, setQueryParams] = useState<QueryParams>({
    username: "",
    limit: 0,
    period: "all",
  });
  const [selectedGrid, setSelectedGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [showTitles, setShowTitles] = useState<boolean>(true);
  const [showRatings, setShowRatings] = useState<boolean>(true);

  const resultRef = useRef<HTMLDivElement>(null);

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

  const handleRenderSuccess = useCallback(() => {
    setIsGenerating(false);
  }, []);

  const {
    collage,
    isRendering,
    renderError,
  } = useCollageRenderer({
    films,
    grid: selectedGrid,
    showTitles,
    showRatings,
    onRenderSuccess: handleRenderSuccess,
  });

  useEffect(() => {
    if (apiError || renderError) {
      setIsGenerating(false);
    }
  }, [apiError, renderError]);

  const isBusyGenerating = isGenerating || isFetching;
  const errorMessage = apiError || renderError;

  useEffect(() => {
    if (!resultRef.current || !collage || isMobile) return;

    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [collage, isMobile]);

  function handleGenerate({
    username,
    grid,
    period,
  }: {
    username: string;
    grid: Grid;
    period: string;
  }) {
    const isSameParams =
      queryParams.username === username &&
      queryParams.period === period &&
      selectedGrid.rows === grid.rows &&
      selectedGrid.cols === grid.cols &&
      Boolean(collage);

    if (isSameParams) {
      if (isMobile) {
        setIsDrawerOpen(true);
      }
      return;
    }

    setIsGenerating(true);
    setSelectedGrid(grid);
    setQueryParams({
      username,
      limit: grid.rows * grid.cols,
      period,
    });

    if (isMobile) {
      setIsDrawerOpen(true);
    }
  }

  return (
    <>
      <Card variant="default" className="min-h-0 w-full flex-1">
        <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-stretch justify-center gap-3 overflow-hidden md:flex-row">
          <div className="mx-auto flex w-full shrink-0 flex-col items-center justify-center p-3 md:max-w-56">
            <CollageForm
              isLoading={isBusyGenerating}
              errorMessage={errorMessage}
              onGenerate={handleGenerate}
            />
          </div>

          <div
            className={`min-h-0 flex-1 md:relative md:flex ${
              isMobile ? "hidden" : collage || isBusyGenerating ? "flex" : "hidden"
            }`}
          >
            <Card
              variant="secondary"
              className="min-h-0 w-full flex-1 md:absolute md:inset-0"
            >
              <Card.Content className="flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden p-3">
                {!collage && !isBusyGenerating && <WelcomeFigure />}

                {isBusyGenerating && <LoadingFigure />}

                {collage && !isBusyGenerating && (
                  <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-3">
                    <div className="flex flex-row shrink-0 w-full items-center justify-between">
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

                    <div
                      ref={resultRef}
                      className={`flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden transition-opacity duration-200 ${
                        isRendering ? "opacity-75" : "opacity-100"
                      }`}
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

      {isMobile && (
        <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <Drawer.Backdrop variant="blur" isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <Drawer.Content placement="bottom" className="h-[90dvh] max-h-[90dvh] rounded-t-2xl">
              <Drawer.Dialog className="flex h-full w-full flex-col outline-none p-4 overflow-hidden">
                <Drawer.Handle className="shrink-0" />
                <Drawer.Header className="flex shrink-0 items-center justify-between pb-2 pt-0">
                  <Drawer.Heading className="font-bold text-sm">
                    {`Your ${selectedGrid.cols}×${selectedGrid.rows} collage`}
                  </Drawer.Heading>
                  <div className="flex items-center gap-2">
                    <DisplayOptions
                      showTitles={showTitles}
                      setShowTitles={setShowTitles}
                      showRatings={showRatings}
                      setShowRatings={setShowRatings}
                    />
                    <Drawer.CloseTrigger />
                  </div>
                </Drawer.Header>

                <Drawer.Body className="flex min-h-0 flex-1 w-full items-center justify-center p-0 overflow-hidden">
                  {isBusyGenerating ? (
                    <LoadingFigure />
                  ) : collage ? (
                    <div
                      className={`flex min-h-0 flex-1 h-full w-full items-center justify-center overflow-hidden transition-opacity duration-200 ${
                        isRendering ? "opacity-75" : "opacity-100"
                      }`}
                    >
                      <ResultFigure src={collage} />
                    </div>
                  ) : null}
                </Drawer.Body>

                <Drawer.Footer className="flex shrink-0 flex-col items-center justify-center pt-2 pb-0">
                  {collage && !isBusyGenerating && (
                    <ResultCardActions imageSrc={collage} />
                  )}
                </Drawer.Footer>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      )}
    </>
  );
}
