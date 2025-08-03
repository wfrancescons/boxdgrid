// deno-lint-ignore-file no-explicit-any
import * as cheerio from "cheerio";

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

function getRating(element: cheerio.Cheerio<any>): Rating {
  const memberRating = element.find("letterboxd\\:memberRating").text()
    .toString();

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

function getImage(element: cheerio.Cheerio<any>): string {
  const description = element.find("description").text();
  const $ = cheerio.load(description);
  const image = $("p img").attr("src");

  if (!image) return "";

  const originalImageCropRegex = /-0-.*-crop/;
  const large = image.replace(originalImageCropRegex, "-0-230-0-345-crop");

  return large;
}

function getReview(element: cheerio.Cheerio<any>): string {
  const description = element.find("description").text();
  const $ = cheerio.load(description);
  const reviewParagraphs = $("p");
  let review = "";

  if (reviewParagraphs.length <= 0) {
    return review;
  }

  if (reviewParagraphs.last().text().includes("Watched on ")) {
    return review;
  }

  reviewParagraphs.each((_i, el) => {
    const reviewParagraph = $(el).text();
    if (reviewParagraph !== "This review may contain spoilers.") {
      review += reviewParagraph + "\n";
    }
  });

  return review.trim();
}

function getSpoilers(element: cheerio.Cheerio<any>): boolean {
  const titleData = element.find("title").text();
  const containsSpoilersString = "(contains spoilers)";
  return titleData.includes(containsSpoilersString);
}

function processItem(
  element: cheerio.Cheerio<any>,
): DiaryEntry | null {
  const linkHtml = element.find("link").html();
  const isListItem = linkHtml?.includes("/list/") ?? false;

  if (isListItem) return null;

  const pubDate = element.find("pubDate").text();
  const watchedDate = element.find("letterboxd\\:watchedDate").text();

  return {
    date: {
      published: pubDate ? +new Date(pubDate) : 0,
      watched: watchedDate ? +new Date(watchedDate) : 0,
    },
    film: {
      title: element.find("letterboxd\\:filmTitle").text(),
      year: element.find("letterboxd\\:filmYear").text(),
      image: getImage(element),
    },
    rating: getRating(element),
    review: getReview(element),
    spoilers: getSpoilers(element),
    isRewatch: element.find("letterboxd\\:rewatch").text() === "Yes",
    link: linkHtml || "",
  };
}

async function getLetterboxdUserXml(username: string): Promise<string> {
  try {
    const response = await fetch(`https://letterboxd.com/${username}/rss/`);

    if (!response.ok) {
      if (response.status === 404) {
        throw "NOT_A_VALID_LETTERBOXD_USER";
      } else {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    }

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
}

async function getUserDiary(username: string): Promise<DiaryEntry[]> {
  try {
    const xml = await getLetterboxdUserXml(username);
    const $ = cheerio.load(xml, { xmlMode: true });

    const itemElements = $("item").toArray();

    const results = itemElements
      .map((element) => processItem($(element)))
      .filter((entry): entry is DiaryEntry => entry !== null);

    return results;
  } catch (error) {
    throw error;
  }
}

export async function getLastFilmsSeen(
  username: string,
  limit = 1,
): Promise<DiaryEntry[]> {
  try {
    const userDiary = await getUserDiary(username);

    if (!userDiary.length) throw "ZERO_ACTIVITIES";

    return userDiary.slice(0, limit);
  } catch (error) {
    throw error;
  }
}

export type { DiaryEntry, Film, FilmDate, Rating };
