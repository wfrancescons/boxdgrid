import { useRef, useState } from "preact/hooks";

interface GridSize {
  rows: number;
  cols: number;
}

type ColorClass = string;
type ColorGrid = ColorClass[][];

const rows = 7;
const cols = 7;

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
  setGrid: (grid: GridSize) => void;
}

export default function GridPicker({ setGrid }: GridPickerProps) {
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const [selected, setSelected] = useState<GridSize>({ rows: 0, cols: 0 });

  const isDragging = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  function handleSelection(row: number, col: number) {
    const grid = { rows: row, cols: col };

    setSelected(grid);
    setHoverRow(row);
    setHoverCol(col);
    setGrid(grid);

    if (navigator.vibrate) navigator.vibrate(10);
  }

  function handleCellEnter(row: number, col: number) {
    if (isDragging.current) {
      handleSelection(row, col);
    } else {
      setHoverRow(row);
      setHoverCol(col);
    }
  }

  function getCellFromPosition(clientX: number, clientY: number) {
    if (!gridRef.current) return null;

    const rect = gridRef.current.getBoundingClientRect();
    const col = Math.ceil(((clientX - rect.left) / rect.width) * cols);
    const row = Math.ceil(((clientY - rect.top) / rect.height) * rows);

    if (row >= 1 && row <= rows && col >= 1 && col <= cols) {
      return { row, col };
    }
    return null;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const cell = getCellFromPosition(touch.clientX, touch.clientY);
    if (cell) handleSelection(cell.row, cell.col);
  }

  const hoverAnchorColor = hoverRow > 0 && hoverCol > 0
    ? hoverAnchorGrid[hoverRow - 1]?.[hoverCol - 1]
    : null;

  return (
    <div className="flex flex-col w-full gap-4 md:gap-2">
      <p className="text-sm font-medium">
        Grid: {hoverCol} x {hoverRow}
      </p>

      <div
        ref={gridRef}
        className="grid grid-cols-7 gap-1.5 md:gap-1 touch-none select-none"
        onPointerUp={() => (isDragging.current = false)}
        onPointerLeave={() => (isDragging.current = false)}
        onMouseLeave={() => {
          if (!isDragging.current) {
            setHoverRow(selected.rows);
            setHoverCol(selected.cols);
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => (isDragging.current = false)}
      >
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: cols }, (_, j) => {
            const row = i + 1;
            const col = j + 1;

            const isSelected = row <= selected.rows && col <= selected.cols;
            const isHovered = row <= hoverRow && col <= hoverCol;

            let bg = "bg-neutral-300/30";
            if (isSelected) {
              bg = selectionGrid[i][j];
            } else if (isHovered && hoverAnchorColor) {
              bg = hoverAnchorColor;
            }

            return (
              <div
                key={`${row}-${col}`}
                className={`aspect-4/5 rounded-sm md:rounded-xs cursor-pointer transition hover:scale-105 ${bg}`}
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
              />
            );
          }))}
      </div>
    </div>
  );
}
