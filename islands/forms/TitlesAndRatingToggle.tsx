import { Signal } from "@preact/signals";

interface TitlesAndRatingToggleProps {
  checked: Signal<boolean>;
}

export default function TitlesAndRatingToggle(
  { checked }: TitlesAndRatingToggleProps,
) {
  return (
    <label class="text-base-content/60 flex items-center gap-2 md:text-xs">
      <input
        type="checkbox"
        class="toggle toggle-sm toggle-primary md:toggle-xs"
        onChange={(e) => checked.value = (e.target as HTMLInputElement).checked}
        checked={checked.value}
      />
      <span>Show titles and rating</span>
    </label>
  );
}
