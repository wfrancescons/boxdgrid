interface ShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
}

interface LinearGradientFill {
  type: "linearGradient";
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  colors: { stop: number; color: string }[];
}

export type FillStyle = string | LinearGradientFill;

interface BaseElement {
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle?: FillStyle;
  composite?: GlobalCompositeOperation;
  filter?: string;
}

export interface ImageElement extends BaseElement {
  type: "image" | "icon";
  src: string;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
}

export interface TextElement {
  type: "text";
  x: number;
  y: number;
  text: string;
  font?: string;
  fillStyle?: string;
  align?: CanvasTextAlign;
  shadow?: ShadowOptions;
  maxWidth?: number;
  lineHeight?: number;
}

export type CanvasElement = ImageElement | RectangleElement | TextElement;

interface RenderData {
  width: number;
  height: number;
  background?: string;
  elements: CanvasElement[];
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function drawImage(
  ctx: CanvasRenderingContext2D,
  element: ImageElement,
): Promise<void> {
  try {
    ctx.filter = element.filter || "none";
    ctx.globalCompositeOperation = element.composite || "source-over";

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = element.src;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });

    ctx.drawImage(image, element.x, element.y, element.width, element.height);

    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";
  } catch (error) {
    console.error("Error loading image:", { error, element });
    drawRect(ctx, {
      type: "rectangle",
      fillStyle: "rgba(0, 0, 0, 0.5)",
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
    });
  }
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  element: RectangleElement,
): void {
  if (
    typeof element.fillStyle === "object" &&
    element.fillStyle.type === "linearGradient"
  ) {
    const gradient = ctx.createLinearGradient(
      element.fillStyle.x0,
      element.fillStyle.y0,
      element.fillStyle.x1,
      element.fillStyle.y1,
    );
    for (const stop of element.fillStyle.colors) {
      gradient.addColorStop(stop.stop, stop.color);
    }
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = element.fillStyle || "black";
  }
  ctx.fillRect(element.x, element.y, element.width, element.height);
}

async function drawText(
  ctx: CanvasRenderingContext2D,
  element: TextElement,
): Promise<void> {
  const font = element.font || "16px sans-serif";

  const fontFamily = font.match(/['"]?([a-zA-Z0-9\s\-]+)['"]?$/)?.[1];
  if (
    fontFamily && !["sans-serif", "serif", "monospace"].includes(fontFamily)
  ) {
    await document.fonts.load(font);
  }

  ctx.shadowColor = element.shadow?.color || "transparent";
  ctx.shadowOffsetX = element.shadow?.offsetX || 0;
  ctx.shadowOffsetY = element.shadow?.offsetY || 0;
  ctx.shadowBlur = element.shadow?.blur || 0;

  ctx.font = font;
  ctx.fillStyle = element.fillStyle || "black";
  ctx.textAlign = element.align || "left";

  const lines = wrapText(ctx, element.text, element.maxWidth || 200);
  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      element.x,
      element.y - (lines.length - 1 - i) * (element.lineHeight || 20),
    );
  });

  ctx.shadowColor = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

export default async function renderCanvas(
  data: RenderData,
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = data.width;
  canvas.height = data.height;

  ctx.fillStyle = data.background || "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const element of data.elements) {
    if (element.type === "image" || element.type === "icon") {
      await drawImage(ctx, element);
    }
    if (element.type === "rectangle") {
      drawRect(ctx, element);
    }
    if (element.type === "text") {
      await drawText(ctx, element);
    }
  }

  return canvas.toDataURL("image/png");
}
