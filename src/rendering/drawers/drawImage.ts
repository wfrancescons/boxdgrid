import { withContextEffects } from "../effects/contextEffects";
import type { ImageElement } from "../types";
import { drawRect } from "./drawShape";

const imageCache = new Map<string, HTMLImageElement>();

export async function loadCachedImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
}

export async function preloadImages(
  srcs: string[],
): Promise<Map<string, HTMLImageElement | Error>> {
  const unique = [...new Set(srcs.filter(Boolean))];
  const entries = await Promise.all(
    unique.map(async (src): Promise<[string, HTMLImageElement | Error]> => {
      try {
        return [src, await loadCachedImage(src)];
      } catch (error) {
        return [src, error instanceof Error ? error : new Error(String(error))];
      }
    }),
  );
  return new Map(entries);
}

export async function drawImage(
  ctx: CanvasRenderingContext2D,
  element: ImageElement,
  preloaded?: Map<string, HTMLImageElement | Error>,
): Promise<void> {
  try {
    let image: HTMLImageElement | null = null;
    const fromMap = preloaded?.get(element.src);
    if (fromMap && !(fromMap instanceof Error)) {
      image = fromMap;
    } else {
      image = await loadCachedImage(element.src);
    }

    await withContextEffects(ctx, element, (c) => {
      const radius = element.borderRadius ?? 0;
      if (radius > 0 && typeof c.roundRect === "function") {
        c.beginPath();
        c.roundRect(
          element.x,
          element.y,
          element.width,
          element.height,
          radius,
        );
        c.clip();
      }

      c.drawImage(image!, element.x, element.y, element.width, element.height);
    });
  } catch (error) {
    console.error("Error on drawImage:", error, element.src);
    await drawRect(ctx, {
      type: "rectangle",
      fillStyle: "rgba(0, 0, 0, 0.5)",
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    });
  }
}

