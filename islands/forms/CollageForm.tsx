import { UserRound } from "lucide-preact";
import { useState } from "preact/hooks";
import renderCanvas from "../../rendering/render.ts";
import gridlbTemplate from "../../rendering/template.ts";
import GridPicker from "../GridPicker.tsx";
import PeriodFilter from "../PeriodFilter.tsx";

export type Grid = { rows: number; cols: number };

interface CollageFormProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setCollage: (collage: string) => void;
  setSelectedGrid: (grid: Grid) => void;
}

function getErrorMessage(res: Response) {
  switch (res.status) {
    case 404:
      return "Username not found";
    case 204:
      return "No diary entries found";
    default:
      return "Something went wrong";
  }
}

export default function CollageForm(
  { isLoading, setLoading, setCollage, setSelectedGrid }: CollageFormProps,
) {
  const [username, setUsername] = useState("");
  const [showTitlesAndRating, setShowTitlesAndRating] = useState(true);
  const [grid, setGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [period, setPeriod] = useState<string>("all");
  const [apiError, setApiError] = useState("");

  const canGenerate = username && grid.rows > 0 && grid.cols > 0;

  async function generateCollage() {
    setLoading(true);
    setApiError("");
    setSelectedGrid(grid);

    const { rows, cols } = grid;

    try {
      const param = showTitlesAndRating ? null : "notexts";

      const url = new URL(
        `/api/letterboxd/${username}`,
        globalThis.location.origin,
      );

      url.searchParams.set("limit", String(rows * cols));
      url.searchParams.set("time", period);

      const res = await fetch(url);

      if (!res.ok) {
        setApiError(getErrorMessage(res));
        return;
      }

      const lastFilms = await res.json();

      const template = gridlbTemplate({
        lastFilms,
        columns: cols,
        rows,
        param,
      });

      const image = await renderCanvas(template);

      setCollage(image);
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-3 w-full"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-2 w-full">
        <span className="text-sm font-medium">
          Letterboxd Username:
        </span>
        <div className="flex flex-col w-full gap-1">
          <label
            className={`input input-border ${
              apiError ? "input-error" : ""
            } flex max-w-none items-center gap-2`}
          >
            <UserRound
              strokeWidth={2.5}
              className="h-4 w-4 opacity-70 stroke-current"
            />
            <input
              type="text"
              className="grow"
              name="letterboxd-username"
              placeholder="username (no @)"
              onInput={(e) =>
                setUsername(
                  (e.target as HTMLInputElement).value.trim(),
                )}
            />
          </label>
          {apiError && (
            <div className="label flex-none">
              <span className="text-error font-bold md:text-xs">
                {apiError}
              </span>
            </div>
          )}
        </div>
      </div>

      <GridPicker setGrid={setGrid} />

      <label className="text-base-content/60 flex items-center gap-2 md:text-xs">
        <input
          type="checkbox"
          className="toggle toggle-sm toggle-primary"
          onChange={(e) =>
            setShowTitlesAndRating(
              (e.target as HTMLInputElement).checked,
            )}
          checked={showTitlesAndRating}
        />
        Show titles and rating
      </label>

      <PeriodFilter period={period} setPeriod={setPeriod} />

      <div className="card-actions items-center gap-6">
        <button
          type="button"
          className="btn btn-primary btn-block transition-all duration-300"
          onClick={generateCollage}
          disabled={isLoading || !canGenerate}
          data-umami-event="Generate button"
        >
          {isLoading
            ? (
              <>
                <span className="loading loading-sm loading-spinner" />
                <span>Generating…</span>
              </>
            )
            : <span>Generate Collage</span>}
        </button>
      </div>
    </form>
  );
}
