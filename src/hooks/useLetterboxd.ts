import type { FilmItem } from "@/rendering/template";
import { useEffect, useMemo } from "react";
import useSWR from "swr";

export function parseUsername(input: string): string {
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

async function letterboxdFetcher(url: string): Promise<FilmItem[]> {
  const res = await fetch(url);

  if (res.status === 204) {
    throw new Error("No diary entries found");
  }

  if (res.status === 404) {
    throw new Error("Username not found");
  }

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return res.json();
}

interface CacheEntry {
  films: FilmItem[];
  requestedLimit: number;
  timestamp: number;
}

const userFilmsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

interface UseLetterboxdParams {
  username: string;
  limit: number;
  period: string;
  enabled?: boolean;
}

export function useLetterboxd({
  username,
  limit,
  period,
  enabled = true,
}: UseLetterboxdParams) {
  let parsedUsername = "";
  let urlError: string | null = null;

  if (username) {
    try {
      parsedUsername = parseUsername(username);
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_LETTERBOXD_URL") {
        urlError = "Please enter a valid URL";
      }
    }
  }

  const cacheKey = parsedUsername ? `${parsedUsername.toLowerCase()}:${period}` : "";

  const cachedEntry = useMemo(() => {
    if (!cacheKey) return null;
    const entry = userFilmsCache.get(cacheKey);
    if (!entry) return null;

    const isFresh = Date.now() - entry.timestamp < CACHE_TTL_MS;
    if (!isFresh) {
      userFilmsCache.delete(cacheKey);
      return null;
    }

    return entry;
  }, [cacheKey, limit]);

  const hasEnoughCached = Boolean(
    cachedEntry && (cachedEntry.films.length >= limit || cachedEntry.requestedLimit >= limit),
  );

  const shouldFetch = Boolean(
    enabled &&
    parsedUsername &&
    limit > 0 &&
    !urlError &&
    !hasEnoughCached,
  );

  const swrKey = shouldFetch
    ? `/api/letterboxd/${parsedUsername}?limit=${limit}&time=${period}`
    : null;

  const { data: fetchedData, error, isLoading: isSwrLoading, mutate } = useSWR<FilmItem[], Error>(
    swrKey,
    letterboxdFetcher,
    {
      dedupingInterval: CACHE_TTL_MS,
      focusThrottleInterval: CACHE_TTL_MS,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (!fetchedData || !cacheKey) return;

    const existing = userFilmsCache.get(cacheKey);
    if (!existing || fetchedData.length >= existing.films.length) {
      userFilmsCache.set(cacheKey, {
        films: fetchedData,
        requestedLimit: Math.max(limit, existing?.requestedLimit ?? 0),
        timestamp: Date.now(),
      });
    }
  }, [fetchedData, cacheKey, limit]);

  const resolvedFilms = useMemo(() => {
    if (hasEnoughCached && cachedEntry) {
      return cachedEntry.films.slice(0, limit);
    }
    if (fetchedData) {
      return fetchedData.slice(0, limit);
    }
    return undefined;
  }, [hasEnoughCached, cachedEntry, fetchedData, limit]);

  const resolvedError = urlError || (error ? error.message : null);

  return {
    films: resolvedFilms,
    isLoading: isSwrLoading && shouldFetch,
    error: resolvedError,
    mutate,
  };
}
