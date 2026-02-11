import { UserRound } from "lucide-preact";
import { useState } from "preact/hooks";
import renderCanvas from "../../rendering/render.ts";
import gridlbTemplate from "../../rendering/template.ts";
import GridPicker from "../GridPicker.tsx";

export type Grid = { rows: number; cols: number };

interface CollageFormProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setCollage: (collage: string) => void;
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
  { isLoading, setLoading, setCollage }: CollageFormProps,
) {
  const [username, setUsername] = useState("");
  const [showTitlesAndRating, setShowTitlesAndRating] = useState(true);
  const [grid, setGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [apiError, setApiError] = useState("");

  const canGenerate = username && grid.rows > 0 && grid.cols > 0;

  async function generateCollage() {
    setLoading(true);
    setApiError("");

    const { rows, cols } = grid;

    try {
      const param = showTitlesAndRating ? null : "notexts";

      const res = await fetch(
        `/api/letterboxd/${username}?limit=${rows * cols}`,
      );

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
    <div className="card-body">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <span className="flex items-center gap-2 md:text-sm font-medium">
          Create your collage
        </span>

        <div>
          <div className="flex flex-col gap-1">
            <label
              className={`input md:input-sm input-border ${
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
                placeholder="Letterboxd username"
                onInput={(e) =>
                  setUsername(
                    (e.target as HTMLInputElement).value.trim(),
                  )}
              />
            </label>
          </div>

          {apiError && (
            <div className="label flex-none">
              <span className="label-text-alt text-error md:text-xs">
                {apiError}
              </span>
            </div>
          )}
        </div>

        <GridPicker setGrid={setGrid} />

        <label className="text-base-content/60 flex items-center gap-2 md:text-xs">
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary md:toggle-xs"
            onChange={(e) =>
              setShowTitlesAndRating(
                (e.target as HTMLInputElement).checked,
              )}
            checked={showTitlesAndRating}
          />
          <span>Show titles and rating</span>
        </label>

        <div className="card-actions items-center gap-6">
          <button
            type="button"
            className="btn btn-primary btn-block md:btn-sm transition-all duration-300"
            onClick={generateCollage}
            disabled={isLoading || !canGenerate}
            data-umami-event="Generate button"
          >
            {isLoading
              ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Generating…</span>
                </>
              )
              : <span>Generate Collage</span>}
          </button>
        </div>
      </form>
    </div>
  );
}
