import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";

type PresetKey = "pickPreset" | "lastFour" | "feed" | "story" | "custom";

interface GridSize {
  rows: number;
  cols: number;
}

type ColorClass = string;

type ColorGrid = ColorClass[][];

const rows = 7;
const cols = 7;

const presets: Record<Exclude<PresetKey, "custom">, GridSize> = {
  pickPreset: { rows: 0, cols: 0 },
  lastFour: { rows: 1, cols: 4 },
  feed: { rows: 3, cols: 4 },
  story: { rows: 4, cols: 3 },
};

const selectionColors: ColorClass[] = [
  "bg-cyan-500",
  "bg-orange-500",
  "bg-green-500",
];
const hoverColors: ColorClass[] = [
  "bg-cyan-200",
  "bg-orange-200",
  "bg-green-200",
];

function pick(arr: ColorClass[]): ColorClass {
  return arr[Math.floor(Math.random() * arr.length)];
}

const selectionGrid: ColorGrid = Array.from(
  { length: rows },
  () => Array.from({ length: cols }, () => pick(selectionColors)),
);

const hoverAnchorGrid: ColorGrid = Array.from(
  { length: rows },
  () => Array.from({ length: cols }, () => pick(hoverColors)),
);

interface GridPickerProps {
  grid: Signal<GridSize>;
}

export default function GridPicker({ grid }: GridPickerProps) {
  const hoverRow = useSignal<number>(0);
  const hoverCol = useSignal<number>(0);
  const selected = useSignal<GridSize>({ rows: 0, cols: 0 });
  const selectedPreset = useSignal<PresetKey>("pickPreset");

  const isDragging = useRef<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  function getPresetKey(r: number, c: number): PresetKey {
    for (
      const [key, val] of Object.entries(presets) as [PresetKey, GridSize][]
    ) {
      if (val.rows === r && val.cols === c) return key;
    }
    return "custom";
  }

  function applyPreset(preset: PresetKey): void {
    selectedPreset.value = preset;
    const map: Partial<Record<PresetKey, GridSize>> = {
      lastFour: { rows: 1, cols: 4 },
      feed: { rows: 3, cols: 4 },
      story: { rows: 4, cols: 3 },
    };
    const { rows: r, cols: c } = map[preset] || { rows: 0, cols: 0 };
    handleSelection(r, c);
  }

  function handleSelection(row: number, col: number): void {
    selected.value = { rows: row, cols: col };
    hoverRow.value = row;
    hoverCol.value = col;
    grid.value = { rows: row, cols: col };

    if (navigator.vibrate) navigator.vibrate(10);

    const isPreset = Object.entries(presets).some(
      ([, val]) => val.rows === row && val.cols === col,
    );
    selectedPreset.value = isPreset ? getPresetKey(row, col) : "custom";
  }

  function handleCellEnter(row: number, col: number): void {
    if (isDragging.current) {
      handleSelection(row, col);
    } else {
      hoverRow.value = row;
      hoverCol.value = col;
    }
  }

  function getCellFromPosition(
    clientX: number,
    clientY: number,
  ): { row: number; col: number } | null {
    if (!gridRef.current) return null;

    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeX = clientX - gridRect.left;
    const relativeY = clientY - gridRect.top;

    const cellWidth = gridRect.width / cols;
    const cellHeight = gridRect.height / rows;

    const col = Math.ceil(relativeX / cellWidth);
    const row = Math.ceil(relativeY / cellHeight);

    if (row >= 1 && row <= rows && col >= 1 && col <= cols) {
      return { row, col };
    }

    return null;
  }

  function handleTouchMove(e: TouchEvent): void {
    if (!isDragging.current) return;

    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (cell) {
      handleSelection(cell.row, cell.col);
    }
  }

  const currentHoverAnchorColor = (): ColorClass | null => {
    if (hoverRow.value > 0 && hoverCol.value > 0) {
      return hoverAnchorGrid[hoverRow.value - 1]?.[hoverCol.value - 1] || null;
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full mx-auto space-y-1" translate={false}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium flex gap-0.5 items-center">
          Grid:
          <span
            key={`col-${hoverCol.value}`}
            className="inline-block animate-fade-in-up"
          >
            {hoverCol.value}
          </span>
          x
          <span
            key={`row-${hoverRow.value}`}
            className="inline-block animate-fade-in-up"
          >
            {hoverRow.value}
          </span>
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-7 gap-1 w-full py-1 touch-none select-none"
        translate={false}
        onPointerUp={() => {
          isDragging.current = false;
        }}
        onPointerLeave={() => {
          isDragging.current = false;
        }}
        onMouseLeave={() => {
          if (!isDragging.current) {
            hoverRow.value = selected.value.rows;
            hoverCol.value = selected.value.cols;
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {
          isDragging.current = false;
        }}
        onTouchCancel={() => {
          isDragging.current = false;
        }}
      >
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: cols }, (_, j) => {
            const row = i + 1;
            const col = j + 1;

            const isHovered = row <= hoverRow.value && col <= hoverCol.value;
            const isSelected = row <= selected.value.rows &&
              col <= selected.value.cols;

            let bgColor: ColorClass = "bg-neutral-300/30";
            if (isSelected) {
              bgColor = selectionGrid[i]?.[j] || bgColor;
            } else if (isHovered && currentHoverAnchorColor()) {
              bgColor = currentHoverAnchorColor()!;
            }

            return (
              <div
                key={`${row}-${col}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  isDragging.current = true;
                  handleSelection(row, col);
                }}
                onPointerEnter={() =>
                  handleCellEnter(row, col)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  isDragging.current = true;
                  handleSelection(row, col);
                }}
                className={`w-full aspect-[4/5] rounded-xs cursor-pointer transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-md/30 active:scale-105 ${bgColor}`}
              />
            );
          }))}
      </div>

      <div className="filter">
        <input
          className="btn filter-reset btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Reset"
          checked={selectedPreset.value === "pickPreset"}
          onChange={() =>
            applyPreset("pickPreset")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Last Four"
          checked={selectedPreset.value === "lastFour"}
          onChange={() =>
            applyPreset("lastFour")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Feed"
          checked={selectedPreset.value === "feed"}
          onChange={() =>
            applyPreset("feed")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Story"
          checked={selectedPreset.value === "story"}
          onChange={() =>
            applyPreset("story")}
        />
      </div>
    </div>
  );
}
