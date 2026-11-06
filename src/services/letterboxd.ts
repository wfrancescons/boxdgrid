import { XMLParser } from "fast-xml-parser";

interface Rating {
  text: string | null;
  score: number;
}

interface FilmDate {
  published: number;
  watched: number;
}

interface Film {
  title: string;
  year: string;
  image: string;
}

interface DiaryEntry {
  date: FilmDate;
  film: Film;
  rating: Rating;
  review: string;
  spoilers: boolean;
  isRewatch: boolean;
  link: string;
}

type ScoreMap = Record<string, string | null>;
type TimeFilter = "all" | "7d" | "15d" | "30d";

const scoreToTextMap: ScoreMap = {
  "-1.0": null,
  "0.5": "½",
  "1.0": "★",
  "1.5": "★½",
  "2.0": "★★",
  "2.5": "★★½",
  "3.0": "★★★",
  "3.5": "★★★½",
  "4.0": "★★★★",
  "4.5": "★★★★½",
  "5.0": "★★★★★",
};

function extractImageFromDescription(description: string): string {
  if (!description) return "";

  const match = description.match(/<img[^>]+src="([^"]+)"/i);
  if (!match) return "";

  const originalImageCropRegex = /-0-.*-crop/;
  return match[1].replace(
    originalImageCropRegex,
    "-0-230-0-345-crop",
  );
}

function extractReviewFromDescription(description: string): string {
  if (!description) return "";

  const paragraphs = Array.from(
    description.matchAll(/<p>(.*?)<\/p>/gis),
  ).map((m) => m[1].replace(/<[^>]+>/g, "").trim());

  if (!paragraphs.length) return "";

  const last = paragraphs[paragraphs.length - 1];
  if (last.includes("Watched on ")) return "";

  return paragraphs
    .filter(
      (p) =>
        p &&
        p !== "This review may contain spoilers.",
    )
    .join("\n")
    .trim();
}

function getRating(memberRatingRaw: unknown): Rating {
  const memberRating = memberRatingRaw ? String(memberRatingRaw).trim() : "";
  return {
    text: scoreToTextMap[memberRating] ?? null,
    score: parseFloat(memberRating) || -1,
  };
}

function getSpoilers(titleRaw: unknown): boolean {
  const title = titleRaw ? String(titleRaw) : "";
  return title.includes("(contains spoilers)");
}

function processItem(item: Record<string, any>): DiaryEntry | null {
  const link = item.link ? String(item.link).trim() : "";
  if (!link || link.includes("/list/")) return null;

  const pubDate = item.pubDate ? String(item.pubDate).trim() : "";
  const watchedDate = item["letterboxd:watchedDate"]
    ? String(item["letterboxd:watchedDate"]).trim()
    : "";

  const descriptionHtml = item.description ? String(item.description) : "";

  return {
    date: {
      published: pubDate ? +new Date(pubDate) : 0,
      watched: watchedDate ? +new Date(watchedDate) : 0,
    },
    film: {
      title: item["letterboxd:filmTitle"]
        ? String(item["letterboxd:filmTitle"]).trim()
        : "",
      year: item["letterboxd:filmYear"]
        ? String(item["letterboxd:filmYear"]).trim()
        : "",
      image: extractImageFromDescription(descriptionHtml),
    },
    rating: getRating(item["letterboxd:memberRating"]),
    review: extractReviewFromDescription(descriptionHtml),
    spoilers: getSpoilers(item.title),
    isRewatch: String(item["letterboxd:rewatch"]).trim() === "Yes",
    link,
  };
}

async function getLetterboxdUserXml(username: string): Promise<string> {
  const response = await fetch(`https://letterboxd.com/${username}/rss/`, {
    cf: {
      cacheEverything: true,
      cacheTtl: 120,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("NOT_A_VALID_LETTERBOXD_USER");
    } else {
      throw new Error(`Request failed with status: ${response.status}`);
    }
  }

  return await response.text();
}

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  isArray: (name) => name === "item",
});

async function getUserDiary(username: string): Promise<DiaryEntry[]> {
  const xml = await getLetterboxdUserXml(username);
  const parsed = parser.parse(xml);

  const items = parsed?.rss?.channel?.item;
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const results: DiaryEntry[] = [];
  for (const item of items) {
    const entry = processItem(item);
    if (entry) results.push(entry);
  }

  return results;
}

function filterByTime(
  diary: DiaryEntry[],
  time: TimeFilter,
): DiaryEntry[] {
  if (time === "all") return diary;

  const now = Date.now();

  const daysMap: Record<Exclude<TimeFilter, "all">, number> = {
    "7d": 7,
    "15d": 15,
    "30d": 30,
  };

  const days = daysMap[time];
  const fromTimestamp = now - (days * 24 * 60 * 60 * 1000);

  return diary.filter(
    (item) =>
      item.date.watched &&
      item.date.watched >= fromTimestamp &&
      item.date.watched <= now,
  );
}

export async function getLastFilmsSeen(
  username: string,
  limit = 1,
  time: TimeFilter = "all",
): Promise<DiaryEntry[]> {
  const userDiary = await getUserDiary(username);

  if (!userDiary.length) throw new Error("ZERO_ACTIVITIES");

  const filtered = filterByTime(userDiary, time);

  return filtered.slice(0, limit);
}

export type { DiaryEntry, Film, FilmDate, Rating, TimeFilter };
