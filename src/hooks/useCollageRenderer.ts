import renderCanvas from "@/rendering/render";
import gridlbTemplate, { type FilmItem } from "@/rendering/template";
import { useEffect, useRef, useState } from "react";

export function resolveOverlayParam(
  showTitles: boolean,
  showRatings: boolean,
): string | null {
  if (showTitles && showRatings) return null;
  if (!showTitles && showRatings) return "notitles";
  if (showTitles && !showRatings) return "noratings";
  return "notexts";
}

interface UseCollageRendererParams {
  films: FilmItem[] | undefined;
  grid: { rows: number; cols: number };
  showTitles: boolean;
  showRatings: boolean;
  onRenderSuccess?: () => void;
}

export function useCollageRenderer({
  films,
  grid,
  showTitles,
  showRatings,
  onRenderSuccess,
}: UseCollageRendererParams) {
  const [collage, setCollage] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const renderSeqRef = useRef<number>(0);
  const lastGridRef = useRef<string>("");
  const lastFilmsRef = useRef<FilmItem[] | undefined>(undefined);

  useEffect(() => {
    if (!films || films.length === 0 || grid.rows === 0 || grid.cols === 0) {
      return;
    }

    const currentSeq = ++renderSeqRef.current;
    let isCancelled = false;

    const currentGridKey = `${grid.rows}x${grid.cols}`;
    const isContentChange =
      lastGridRef.current !== currentGridKey || lastFilmsRef.current !== films;

    const delay = isContentChange ? 0 : 120;

    const timeoutId = setTimeout(async () => {
      setIsRendering(true);
      setRenderError(null);

      try {
        const param = resolveOverlayParam(showTitles, showRatings);
        const template = gridlbTemplate({
          lastFilms: films!,
          columns: grid.cols,
          rows: grid.rows,
          param,
        });

        const image = await renderCanvas(template);

        if (!isCancelled && currentSeq === renderSeqRef.current) {
          setCollage(image);
          lastGridRef.current = currentGridKey;
          lastFilmsRef.current = films;
          onRenderSuccess?.();
        }
      } catch (err) {
        if (!isCancelled && currentSeq === renderSeqRef.current) {
          console.error("Error rendering canvas:", err);
          setRenderError("Failed to render collage canvas");
        }
      } finally {
        if (!isCancelled && currentSeq === renderSeqRef.current) {
          setIsRendering(false);
        }
      }
    }, delay);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [films, grid.rows, grid.cols, showTitles, showRatings, onRenderSuccess]);

  return {
    collage,
    isRendering,
    renderError,
    setCollage,
  };
}
