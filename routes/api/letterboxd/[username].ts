import { FreshContext } from "$fresh/server.ts";
import { getLastFilmsSeen } from "../../../services/letterboxd.ts";

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

export async function handler(
  req: Request,
  ctx: FreshContext,
): Promise<Response> {
  const { username } = ctx.params;
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "3", 10);

  try {
    const films = await getLastFilmsSeen(username, limit);

    if (films.length === 0) {
      return new Response(null, { status: 204 }); // No Content
    }

    for (const film of films) {
      if (film.film.image) {
        film.film.image = await fetchImageAsDataURI(film.film.image);
      }
    }

    return new Response(JSON.stringify(films), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
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
}
