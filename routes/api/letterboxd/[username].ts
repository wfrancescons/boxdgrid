import { FilmItem } from "@/rendering/template.ts";
import {
  DiaryEntry,
  getLastFilmsSeen,
  TimeFilter,
} from "@/services/letterboxd.ts";
import { define } from "@/utils.ts";

async function fetchImageAsDataURI(url: string): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch image:", response.statusText);
      return "";
    }

    const buffer = new Uint8Array(await response.arrayBuffer());
    const base64 = btoa(String.fromCharCode(...buffer));
    const ext = url.split(".").pop()?.toLowerCase() || "jpg";

    return `data:image/${ext};base64,${base64}`;
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

export const handler = define.handlers({
  async GET(ctx) {
    const { username } = ctx.params;

    const limit = Number(ctx.url.searchParams.get("limit") ?? "3");
    const timeParam = ctx.url.searchParams.get("time");
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

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);

      if (message === "NOT_A_VALID_LETTERBOXD_USER") {
        return new Response(JSON.stringify({ error: message }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (message === "ZERO_ACTIVITIES") {
        return new Response(null, { status: 204 });
      }

      return new Response(
        JSON.stringify({ error: message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
});
