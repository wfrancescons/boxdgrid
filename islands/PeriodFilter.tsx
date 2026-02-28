import { TargetedEvent } from "preact";

interface PeriodFilterProps {
  period: string;
  setPeriod: (period: string) => void;
}

export default function PeriodFilter({ period, setPeriod }: PeriodFilterProps) {
  function handleChange(event: TargetedEvent<HTMLInputElement, Event>) {
    setPeriod(event.currentTarget.value);
  }

  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-sm font-medium">
        Time Period:
      </legend>

      <div className="flex flex-row gap-2 *:btn *:md:btn-xs *:checked:btn-info *:checked:text-white">
        <input
          type="radio"
          className="filter-reset"
          name="period"
          value="all"
          aria-label="All"
          checked={period === "all"}
          onChange={handleChange}
        />
        <input
          type="radio"
          name="period"
          value="7d"
          aria-label="7d"
          checked={period === "7d"}
          onChange={handleChange}
        />
        <input
          type="radio"
          name="period"
          value="15d"
          aria-label="15d"
          checked={period === "15d"}
          onChange={handleChange}
        />
        <input
          type="radio"
          name="period"
          value="30d"
          aria-label="30d"
          checked={period === "30d"}
          onChange={handleChange}
        />
      </div>
    </fieldset>
  );
}
