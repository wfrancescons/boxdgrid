import { useRef, useState } from "preact/hooks";

export default function GridPicker(props) {
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const [selected, setSelected] = useState({ rows: 0, cols: 0 });
  const [colorGrid, setColorGrid] = useState([]);
  const [hoverColor, setHoverColor] = useState("bg-blue-300");
  const [selectedPreset, setSelectedPreset] = useState("pickPreset");

  const isDragging = useRef(false);

  const rows = 7;
  const cols = 7;

  const presets = {
    pickPreset: { rows: 0, cols: 0 },
    lastFour: { rows: 1, cols: 4 },
    feed: { rows: 3, cols: 4 },
    story: { rows: 4, cols: 3 },
  };

  function randomColor() {
    const colors = ["bg-cyan-500", "bg-orange-500", "bg-green-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function randomHoverColor() {
    const lightColors = ["bg-cyan-200", "bg-orange-200", "bg-green-200"];
    return lightColors[Math.floor(Math.random() * lightColors.length)];
  }

  function getPresetKey(r, c) {
    for (const [key, val] of Object.entries(presets)) {
      if (val.rows === r && val.cols === c) {
        return key;
      }
    }
    return "custom";
  }

  function applyPreset(preset) {
    setSelectedPreset(preset);
    const map = {
      lastFour: { rows: 1, cols: 4 },
      feed: { rows: 3, cols: 4 },
      story: { rows: 4, cols: 3 },
    };
    const { rows: r, cols: c } = map[preset] || { rows: 0, cols: 0 };
    handleSelection(r, c);
  }

  function handleSelection(row, col) {
    setSelected({ rows: row, cols: col });
    setHoverRow(row);
    setHoverCol(col);
    setHoverColor(randomHoverColor());
    props.grid.value = { rows: row, cols: col };

    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    const isPreset = Object.entries(presets).some(
      ([_, val]) => val.rows === row && val.cols === col,
    );
    setSelectedPreset(isPreset ? getPresetKey(row, col) : "custom");

    const newColorGrid = Array.from(
      { length: rows },
      (_, i) =>
        Array.from(
          { length: cols },
          (_, j) => i < row && j < col ? randomColor() : null,
        ),
    );

    setColorGrid(newColorGrid);
  }

  function handlePointer(e) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target) return;

    const cell = target.closest("[data-row][data-col]");
    if (!cell) return;

    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));

    if (!isNaN(row) && !isNaN(col)) {
      handleSelection(row, col);
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto space-y-1" translate={false}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium flex gap-0.5 items-center">
          Grid:
          <span
            key={`col-${hoverCol}`}
            className="inline-block animate-fade-in-up"
          >
            {hoverCol}
          </span>
          x
          <span
            key={`row-${hoverRow}`}
            className="inline-block animate-fade-in-up"
          >
            {hoverRow}
          </span>
        </p>
      </div>

      {/* Grade com suporte a arrastar */}
      <div
        className="grid grid-cols-7 gap-1 w-full py-1 touch-none select-none"
        translate={false}
        onPointerDown={(e) => {
          isDragging.current = true;
          handlePointer(e);
        }}
        onPointerMove={(e) => {
          if (isDragging.current) {
            handlePointer(e);
          }
        }}
        onPointerUp={() => {
          isDragging.current = false;
        }}
        onPointerLeave={() => {
          isDragging.current = false;
        }}
        onMouseLeave={() => {
          if (!isDragging.current) {
            setHoverRow(selected.rows);
            setHoverCol(selected.cols);
          }
        }}
      >
        {Array.from({ length: rows }, (_, i) =>
          Array.from({ length: cols }, (_, j) => {
            const row = i + 1;
            const col = j + 1;

            const isHovered = row <= hoverRow && col <= hoverCol;
            const isSelected = row <= selected.rows && col <= selected.cols;
            const bgColor = isSelected
              ? colorGrid[i]?.[j] || "bg-neutral-300/30"
              : isHovered
              ? hoverColor
              : "bg-neutral-300/30";

            return (
              <div
                key={`${row}-${col}`}
                data-row={row}
                data-col={col}
                onMouseEnter={() => {
                  if (!isDragging.current) {
                    setHoverRow(row);
                    setHoverCol(col);
                    setHoverColor(randomHoverColor());
                  }
                }}
                className={`w-full aspect-[4/5] rounded-xs cursor-pointer transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-md/30 ${bgColor}`}
              />
            );
          }))}
      </div>

      {/* Presets */}
      <div className="filter">
        <input
          className="btn filter-reset btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Reset"
          checked={selectedPreset === "pickPreset"}
          onChange={() =>
            applyPreset("pickPreset")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Last Four"
          checked={selectedPreset === "lastFour"}
          onChange={() =>
            applyPreset("lastFour")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Feed"
          checked={selectedPreset === "feed"}
          onChange={() =>
            applyPreset("feed")}
        />
        <input
          className="btn btn-sm lg:btn-xs"
          type="radio"
          name="gridPresets"
          aria-label="Story"
          checked={selectedPreset === "story"}
          onChange={() => applyPreset("story")}
        />
      </div>
    </div>
  );
}
