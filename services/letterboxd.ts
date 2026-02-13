// deno-lint-ignore-file no-explicit-any
import { parse } from "@melvdouc/xml-parser";

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
type XmlNode = any;

function findChildren(node: XmlNode, tag: string): XmlNode[] {
  if (!node?.children) return [];
  return node.children.filter(
    (child: XmlNode) =>
      child.kind === "REGULAR_TAG_NODE" &&
      child.tagName === tag,
  );
}

function findFirst(node: XmlNode, tag: string): XmlNode | null {
  return findChildren(node, tag)[0] ?? null;
}

function getText(node: XmlNode | null): string {
  if (!node?.children) return "";

  return node.children
    .filter((c: XmlNode) => typeof c.value === "string")
    .map((c: XmlNode) => c.value)
    .join("")
    .trim();
}

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

function extractReviewFromDescription(
  description: string,
): string {
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

function getRating(item: XmlNode): Rating {
  const ratingNode = findFirst(
    item,
    "letterboxd:memberRating",
  );
  const memberRating = getText(ratingNode);

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

  return {
    text: scoreToTextMap[memberRating] ?? null,
    score: parseFloat(memberRating) || -1,
  };
}

function getSpoilers(item: XmlNode): boolean {
  const titleNode = findFirst(item, "title");
  const title = getText(titleNode);
  return title.includes("(contains spoilers)");
}

function processItem(
  item: XmlNode,
  descriptionHtml: string,
): DiaryEntry | null {
  const linkNode = findFirst(item, "link");
  const link = getText(linkNode);

  if (link.includes("/list/")) return null;

  const pubDate = getText(findFirst(item, "pubDate"));
  const watchedDate = getText(
    findFirst(item, "letterboxd:watchedDate"),
  );

  return {
    date: {
      published: pubDate ? +new Date(pubDate) : 0,
      watched: watchedDate ? +new Date(watchedDate) : 0,
    },
    film: {
      title: getText(
        findFirst(item, "letterboxd:filmTitle"),
      ),
      year: getText(
        findFirst(item, "letterboxd:filmYear"),
      ),
      image: extractImageFromDescription(
        descriptionHtml,
      ),
    },
    rating: getRating(item),
    review: extractReviewFromDescription(
      descriptionHtml,
    ),
    spoilers: getSpoilers(item),
    isRewatch: getText(
      findFirst(item, "letterboxd:rewatch"),
    ) === "Yes",
    link,
  };
}

async function getLetterboxdUserXml(
  username: string,
): Promise<string> {
  const response = await fetch(
    `https://letterboxd.com/${username}/rss/`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw "NOT_A_VALID_LETTERBOXD_USER";
    } else {
      throw new Error(
        `Request failed with status: ${response.status}`,
      );
    }
  }

  return await response.text();
}

async function getUserDiary(
  username: string,
): Promise<DiaryEntry[]> {
  const xml = await getLetterboxdUserXml(username);

  const itemMatches = Array.from(
    xml.matchAll(/<item>([\s\S]*?)<\/item>/g),
  );

  const results: DiaryEntry[] = [];

  for (const match of itemMatches) {
    const itemXml = `<item>${match[1]}</item>`;

    const descriptionMatch = itemXml.match(
      /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/,
    );

    const descriptionHtml = descriptionMatch?.[1] ?? "";

    const parsed = parse(itemXml);

    const itemNode = parsed.find(
      (n: XmlNode) =>
        n.kind === "REGULAR_TAG_NODE" &&
        n.tagName === "item",
    );

    if (!itemNode) continue;

    const entry = processItem(
      itemNode,
      descriptionHtml,
    );

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

  const daysMap: Record<
    Exclude<TimeFilter, "all">,
    number
  > = {
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

  if (!userDiary.length) throw "ZERO_ACTIVITIES";

  const filtered = filterByTime(userDiary, time);

  return filtered.slice(0, limit);
}

export type { DiaryEntry, Film, FilmDate, Rating, TimeFilter };
