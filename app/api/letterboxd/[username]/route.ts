import { NextResponse } from "next/server";
import { FilmItem } from "@/rendering/template";
import {
  DiaryEntry,
  getLastFilmsSeen,
  TimeFilter,
} from "@/services/letterboxd";

async function fetchImageAsDataURI(url: string): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch image:", response.statusText);
      return "";
    }

    let mime = response.headers.get("content-type") || "";

    if (!mime.startsWith("image/")) {
      const pathname = new URL(url).pathname;
      let ext = pathname.split(".").pop()?.toLowerCase() || "jpg";

      if (ext === "jpg") ext = "jpeg";

      mime = `image/${ext}`;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error("Error fetching image:", err);
    return "";
  }
}

function parseTimeFilter(value: string | null): TimeFilter {
  const allowed: TimeFilter[] = ["all", "7d", "15d", "30d"];

  if (value && allowed.includes(value as TimeFilter)) {
    return value as TimeFilter;
  }

  return "all";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> | { username: string } },
) {
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;

  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? "3");
  const timeParam = url.searchParams.get("time");
  const time = parseTimeFilter(timeParam);

  try {
    const films: DiaryEntry[] = await getLastFilmsSeen(
      username,
      limit,
      time,
    );

    if (films.length === 0) {
      return new Response(null, { status: 204 });
    }

    const result: FilmItem[] = [];

    for (const film of films) {
      let image = film.film.image;

      if (image) {
        image = await fetchImageAsDataURI(image);
      }

      result.push({
        film: {
          title: film.film.title,
          year: film.film.year,
          image: image ?? "",
        },
        rating: film.rating,
        isRewatch: film.isRewatch,
        review: film.review,
      });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message === "NOT_A_VALID_LETTERBOXD_USER") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message === "ZERO_ACTIVITIES") {
      return new Response(null, { status: 204 });
    }

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}

