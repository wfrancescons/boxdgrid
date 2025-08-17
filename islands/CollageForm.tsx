import { Signal, useComputed, useSignal } from "@preact/signals";
import ApiErrorLabel from "../components/forms/ApiErrorLabel.tsx";
import GenerateButton from "../components/forms/GenerateButton.tsx";
import TitlesAndRatingToggle from "../components/forms/TitlesAndRatingToggle.tsx";
import UsernameInput from "../components/forms/UsernameInput.tsx";
import renderCanvas from "../rendering/render.ts";
import gridlbTemplate from "../rendering/template.ts";
import GridPicker from "./GridPicker.tsx";

interface CollageFormProps {
  isLoading: Signal<boolean>;
  collage: Signal<string>;
  hasImage: Signal<boolean>;
  scrollToImage: () => void;
}

export type Grid = { rows: number; cols: number };

export default function CollageForm(
  {
    isLoading,
    collage,
    hasImage,
    scrollToImage,
  }: CollageFormProps,
) {
  const letterboxdUsername = useSignal<string>("");
  const showTitlesAndRating = useSignal<boolean>(true);
  const grid = useSignal<Grid>({ rows: 0, cols: 0 });
  const apiError = useSignal<string>("");

  const canGenerate = useComputed(() =>
    letterboxdUsername.value !== "" &&
    grid.value.rows > 0 &&
    grid.value.cols > 0
  );

  async function generateCollage() {
    isLoading.value = true;
    hasImage.value = false;
    apiError.value = "";

    const columns = grid.value.cols;
    const rows = grid.value.rows;

    try {
      const param = showTitlesAndRating.value ? null : "notexts";

      const res = await fetch(
        `/api/letterboxd/${letterboxdUsername.value}?limit=${columns * rows}`,
      );

      if (res.status === 404) {
        apiError.value = "Username not found.";
        return;
      }

      if (res.status === 204) {
        apiError.value = "No diary entries found.";
        return;
      }

      if (!res.ok) {
        apiError.value = "Something went wrong.";
        throw new Error(`Error: ${res.status}`);
      }

      const lastFilms = await res.json();

      const letterboxdTemplate = gridlbTemplate({
        lastFilms,
        columns,
        rows,
        param,
      });

      const image = await renderCanvas(letterboxdTemplate);
      collage.value = image;

      hasImage.value = true;

      if (globalThis.innerWidth < 768) scrollToImage();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      isLoading.value = false;
    }
  }

  return (
    <div className="card-body">
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <span class="flex items-center gap-2 md:text-sm font-medium">
          Create your collage
        </span>
        <div>
          <UsernameInput
            value={letterboxdUsername}
            apiError={apiError.value}
          />
          <ApiErrorLabel errorMessage={apiError.value} />
        </div>
        <GridPicker selection={grid} />
        <TitlesAndRatingToggle checked={showTitlesAndRating} />
        <GenerateButton
          isLoading={isLoading}
          generateCollage={generateCollage}
          canGenerate={canGenerate}
        />
      </form>
    </div>
  );
}
