"use client";

import {
  Button,
  FieldError,
  InputGroup,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import GridPicker from "../GridPicker";
import PeriodFilter from "../PeriodFilter";

export type Grid = { rows: number; cols: number };

const STORAGE_USERNAME_KEY = "boxdgrid:username";

interface CollageFormProps {
  isLoading: boolean;
  errorMessage?: string | null;
  onGenerate: (params: { username: string; grid: Grid; period: string }) => void;
}

export default function CollageForm({
  isLoading,
  errorMessage,
  onGenerate,
}: CollageFormProps) {
  const [username, setUsername] = useState("");
  const [grid, setGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [period, setPeriod] = useState<string>("all");
  const [localError, setLocalError] = useState<string>("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERNAME_KEY);
      if (saved) {
        setUsername(saved);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  function handleUsernameChange(value: string) {
    const trimmed = value.trim();
    setUsername(trimmed);
    if (localError) setLocalError("");
    try {
      localStorage.setItem(STORAGE_USERNAME_KEY, trimmed);
    } catch {
      // Ignore storage access errors
    }
  }

  const canGenerate = Boolean(username && grid.rows > 0 && grid.cols > 0);
  const displayError = localError || errorMessage || "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canGenerate || isLoading) return;
    setLocalError("");
    onGenerate({ username, grid, period });
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <TextField
        name="letterboxd-username"
        value={username}
        onChange={handleUsernameChange}
        isInvalid={Boolean(displayError)}
        fullWidth
      >
        <Label>Letterboxd Username:</Label>
        <InputGroup fullWidth variant="secondary">
          <InputGroup.Prefix>
            <UserRound strokeWidth={2.5} className="size-4 opacity-70" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="username" />
        </InputGroup>
        {displayError && <FieldError>{displayError}</FieldError>}
      </TextField>

      <GridPicker setGrid={setGrid} />

      <PeriodFilter period={period} setPeriod={setPeriod} />

      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isPending={isLoading}
        isDisabled={isLoading || !canGenerate}
        data-umami-event="Generate button"
      >
        {isLoading && <Spinner color="current" size="sm" />}
        {isLoading ? "Generating…" : "Generate Collage"}
      </Button>
    </form>
  );
}
