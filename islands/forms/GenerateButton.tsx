import { Signal } from "@preact/signals";

interface GenerateButtonProps {
  isLoading: Signal<boolean>;
  generateCollage: () => void;
  canGenerate: Signal<boolean>;
}

export default function GenerateButton(
  { isLoading, generateCollage, canGenerate }: GenerateButtonProps,
) {
  if (isLoading.value) {
    return (
      <div class="card-actions items-center gap-6">
        <button
          type="button"
          class="btn btn-primary btn-block md:btn-sm"
          disabled
        >
          <span class="loading loading-spinner loading-xs" />
          <span>Generating…</span>
        </button>
      </div>
    );
  }
  return (
    <div class="card-actions items-center gap-6">
      <button
        type="button"
        class="btn btn-primary btn-block md:btn-sm"
        onClick={generateCollage}
        disabled={!canGenerate.value}
        data-umami-event="Generate button"
      >
        <span>Generate Collage</span>
      </button>
    </div>
  );
}
