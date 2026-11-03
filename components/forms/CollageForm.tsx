"use client";

import {
  Button,
  FieldError,
  InputGroup,
  Label,
  Spinner,
  Switch,
  TextField,
} from "@heroui/react";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import renderCanvas from "@/rendering/render";
import gridlbTemplate from "@/rendering/template";
import GridPicker from "../GridPicker";
import PeriodFilter from "../PeriodFilter";

export type Grid = { rows: number; cols: number };

const STORAGE_USERNAME_KEY = "boxdgrid:username";

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

function parseUsername(input: string): string {
  const value = input.trim();

  try {
    const url = new URL(value);

    if (!url.hostname.includes("letterboxd.com")) {
      throw new Error("INVALID_LETTERBOXD_URL");
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length === 0) {
      throw new Error("INVALID_LETTERBOXD_URL");
    }

    return parts[0];
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
  }

  if (value.startsWith("@")) {
    return value.slice(1);
  }

  return value;
}

function resolveOverlayParam(
  showTitles: boolean,
  showRatings: boolean,
): string | null {
  if (showTitles && showRatings) return null;
  if (!showTitles && showRatings) return "notitles";
  if (showTitles && !showRatings) return "noratings";
  return "notexts";
}

export default function CollageForm({
  isLoading,
  setLoading,
  setCollage,
  setSelectedGrid,
}: CollageFormProps) {
  const [username, setUsername] = useState("");
  const [showTitles, setShowTitles] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [grid, setGrid] = useState<Grid>({ rows: 0, cols: 0 });
  const [period, setPeriod] = useState<string>("all");
  const [apiError, setApiError] = useState("");

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
    if (apiError) setApiError("");
    try {
      localStorage.setItem(STORAGE_USERNAME_KEY, trimmed);
    } catch {
      // Ignore storage access errors
    }
  }

  const canGenerate = Boolean(username && grid.rows > 0 && grid.cols > 0);

  async function generateCollage() {
    if (!canGenerate || isLoading) return;

    setLoading(true);
    setApiError("");
    setSelectedGrid(grid);

    const { rows, cols } = grid;

    try {
      const param = resolveOverlayParam(showTitles, showRatings);
      const parsedUsername = parseUsername(username);

      const url = new URL(
        `/api/letterboxd/${parsedUsername}`,
        window.location.origin,
      );

      url.searchParams.set("limit", String(rows * cols));
      url.searchParams.set("time", period);

      const res = await fetch(url);

      if (!res.ok) {
        setApiError(getErrorMessage(res));
        return;
      }

      if (res.status === 204) {
        setApiError("No diary entries found");
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
      if (err instanceof Error && err.message === "INVALID_LETTERBOXD_URL") {
        setApiError("Please enter a valid URL");
        return;
      }
      console.error("Erro ao gerar imagem:", err);
      setApiError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        generateCollage();
      }}
    >
      <TextField
        name="letterboxd-username"
        value={username}
        onChange={handleUsernameChange}
        isInvalid={Boolean(apiError)}
        fullWidth
      >
        <Label>Letterboxd Username:</Label>
        <InputGroup fullWidth>
          <InputGroup.Prefix>
            <UserRound strokeWidth={2.5} className="size-4 opacity-70" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="username" />
        </InputGroup>
        {apiError && <FieldError>{apiError}</FieldError>}
      </TextField>

      <GridPicker setGrid={setGrid} />

      <div className="flex flex-col gap-2">
        <Switch size="sm" isSelected={showTitles} onChange={setShowTitles}>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Label>Show titles</Label>
          </Switch.Content>
        </Switch>

        <Switch size="sm" isSelected={showRatings} onChange={setShowRatings}>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Label>Show ratings & icons</Label>
          </Switch.Content>
        </Switch>
      </div>

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
