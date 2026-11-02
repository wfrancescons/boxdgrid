import { drawImage, preloadImages } from "./drawers/drawImage";
import { drawCircle, drawRect } from "./drawers/drawShape";
import { drawText, ensureFontsLoaded } from "./drawers/drawText";
import type {
  CanvasElement,
  CanvasTemplateData,
  CircleElement,
  GlassEffectOptions,
  ImageElement,
  RectangleElement,
  TextElement,
} from "./types";

export * from "./drawers/drawText";
export * from "./elements";
export * from "./types";
export * from "./watermark";

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function isHeavyElement(element: CanvasElement): boolean {
  if (element.type === "rectangle" && element.style?.type === "glass") {
    return true;
  }
  if (element.type === "circle" && element.style?.type === "glass") {
    return true;
  }
  if (element.type === "text" && element.vibrancy) {
    return true;
  }
  if (
    (element.type === "image" || element.type === "icon") &&
    element.filter &&
    element.filter !== "none"
  ) {
    return true;
  }
  return false;
}

export default async function renderCanvas(
  data: CanvasTemplateData,
): Promise<string> {
  await ensureFontsLoaded();
  await yieldToEventLoop();

  const canvas = document.createElement("canvas");
  canvas.width = data.width;
  canvas.height = data.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Unable to create canvas 2d context");
  }

  ctx.fillStyle = data.background || "#0E0E0E";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Preload all images upfront
  const imageSrcs: string[] = [];
  for (const el of data.elements) {
    if (el.type === "image" || el.type === "icon") {
      imageSrcs.push((el as ImageElement).src);
    }
  }
  const preloaded = await preloadImages(imageSrcs);
  await yieldToEventLoop();

  let opsSinceLastYield = 0;

  for (const element of data.elements) {
    switch (element.type) {
      case "image":
      case "icon":
        await drawImage(ctx, element, preloaded);
        break;
      case "rectangle":
        await drawRect(ctx, element);
        break;
      case "circle":
        await drawCircle(ctx, element);
        break;
      case "text":
        await drawText(ctx, element);
        break;
    }

    opsSinceLastYield += isHeavyElement(element) ? 4 : 1;
    if (opsSinceLastYield >= 16) {
      opsSinceLastYield = 0;
      await yieldToEventLoop();
    }
  }

  await yieldToEventLoop();

  return canvas.toDataURL("image/png");
}
