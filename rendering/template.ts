import { LOGO, REVIEW, REWATCH } from "./images.ts";

import type {
  CanvasElement,
  FillStyle,
  ImageElement,
  RectangleElement,
  TextElement,
} from "./render.ts";

interface Config {
  POSTER_WIDTH: number;
  POSTER_HEIGHT: number;
  GRADIENT_HEIGHT: number;
  ICON_SIZE: number;
  ICON_MARGIN: number;
  TEXT_PADDING: number;
  TEXT_LINE_HEIGHT: number;
  BOTTOM_TEXT_Y_OFFSET: number;
  REGULAR_TEXT_Y_OFFSET: number;
  TITLE_FONT_SIZE: number;
  RATING_FONT_SIZE: number;
}

interface FilmItem {
  film: {
    title: string;
    year?: number;
    image: string;
  };
  rating?: { text: string };
  isRewatch?: boolean;
  review?: string;
}

interface GridTemplateProps {
  lastFilms: FilmItem[];
  columns: number;
  rows: number;
  param?: string | null;
}

function createImageElement(
  { src, x, y, width, height }: Omit<ImageElement, "type">,
): ImageElement {
  return { type: "image", src, x, y, width, height };
}

function createIconElement(
  { src, x, y, width, height }: Omit<ImageElement, "type">,
): ImageElement {
  return { type: "icon", src, x, y, width, height };
}

function createRectangleElement(
  { fillStyle, x, y, width, height }: Omit<RectangleElement, "type">,
): RectangleElement {
  return { type: "rectangle", fillStyle, x, y, width, height };
}

function createTextElement(
  { text, x, y, font, fillStyle, shadow, maxWidth, lineHeight }: Omit<
    TextElement,
    "type"
  >,
): TextElement {
  return {
    type: "text",
    text,
    x,
    y,
    font,
    fillStyle,
    shadow,
    maxWidth,
    lineHeight,
  };
}

function createGradientRectangle(
  x: number,
  y: number,
  config: Config,
): RectangleElement {
  const fillStyle: FillStyle = {
    type: "linearGradient",
    colors: [
      { stop: 0, color: "rgba(14, 14, 14, 0)" },
      { stop: 1, color: "rgba(14, 14, 14, 0.9)" },
    ],
    x0: x,
    y0: y + config.POSTER_HEIGHT - config.GRADIENT_HEIGHT,
    x1: x,
    y1: y + config.POSTER_HEIGHT,
  };

  return createRectangleElement({
    fillStyle,
    x,
    y: y + config.POSTER_HEIGHT - config.GRADIENT_HEIGHT,
    width: config.POSTER_WIDTH,
    height: config.GRADIENT_HEIGHT,
  });
}

function generatePosterData(
  item: FilmItem,
  index: number,
  columns: number,
  param: string | null | undefined,
  config: Config,
): CanvasElement[] {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = column * config.POSTER_WIDTH;
  const y = row * config.POSTER_HEIGHT;

  const posterElements: CanvasElement[] = [];

  if (item.film.image !== "") {
    posterElements.push(createImageElement({
      src: item.film.image,
      x,
      y,
      width: config.POSTER_WIDTH,
      height: config.POSTER_HEIGHT,
    }));
  } else {
    posterElements.push(createRectangleElement({
      fillStyle: "rgba(0, 0, 0, 0.5)",
      x,
      y,
      width: config.POSTER_WIDTH,
      height: config.POSTER_HEIGHT,
    }));
  }

  if (param === "notexts") return posterElements;

  posterElements.push(createGradientRectangle(x, y, config));

  const title = `${item.film.title}${
    item.film.year ? ` (${item.film.year})` : ""
  }`;
  const shouldDrawTextAtBottom = !item.rating?.text && !item.isRewatch &&
    !item.review;

  const textY = shouldDrawTextAtBottom
    ? y + config.POSTER_HEIGHT - config.BOTTOM_TEXT_Y_OFFSET
    : y + config.POSTER_HEIGHT - config.REGULAR_TEXT_Y_OFFSET;

  posterElements.push(createTextElement({
    text: title,
    x: x + config.TEXT_PADDING,
    y: textY,
    font: `bold ${config.TITLE_FONT_SIZE}px "Noto Sans JP", sans-serif`,
    fillStyle: "#ffffff",
    shadow: {
      color: "rgba(0, 0, 0, 0.5)",
      offsetX: 2,
      offsetY: 2,
      blur: 4,
    },
    maxWidth: config.POSTER_WIDTH - 2 * config.TEXT_PADDING,
    lineHeight: config.TEXT_LINE_HEIGHT,
  }));

  if (item.rating?.text) {
    posterElements.push(createTextElement({
      text: item.rating.text,
      x: x + config.TEXT_PADDING,
      y: y + config.POSTER_HEIGHT - config.TEXT_PADDING,
      font: `bold ${config.RATING_FONT_SIZE}px "Noto Sans JP", sans-serif`,
      fillStyle: "#00c030",
      shadow: {
        color: "rgba(0, 0, 0, 0.5)",
        offsetX: 2,
        offsetY: 2,
        blur: 4,
      },
      maxWidth: config.POSTER_WIDTH - 2 * config.TEXT_PADDING,
      lineHeight: config.TEXT_LINE_HEIGHT,
    }));
  }

  let iconX = x + config.POSTER_WIDTH - config.ICON_MARGIN - config.ICON_SIZE;

  if (item.review) {
    posterElements.push(createIconElement({
      src: REVIEW,
      x: iconX,
      y: y + config.POSTER_HEIGHT - config.ICON_MARGIN - config.ICON_SIZE,
      width: config.ICON_SIZE,
      height: config.ICON_SIZE,
    }));
    iconX -= config.ICON_SIZE + config.ICON_MARGIN;
  }

  if (item.isRewatch) {
    posterElements.push(createIconElement({
      src: REWATCH,
      x: iconX,
      y: y + config.POSTER_HEIGHT - config.ICON_MARGIN - config.ICON_SIZE,
      width: config.ICON_SIZE,
      height: config.ICON_SIZE,
    }));
  }

  return posterElements;
}

function generateWatermark(
  data: { width: number; height: number },
): CanvasElement[] {
  const elements: CanvasElement[] = [];

  if (data.width > 230) {
    elements.push(createImageElement({
      src: LOGO,
      x: 15,
      y: data.height - 30 - 11,
      width: 120,
      height: 22,
    }));
  }

  elements.push(createTextElement({
    text: "boxdgrid.deno.dev",
    x: data.width - 200,
    y: data.height - 22,
    font: `bold 20px "Noto Sans JP", sans-serif`,
    fillStyle: "#dcdbdc",
    shadow: {
      color: "rgba(0, 0, 0, 0.5)",
      offsetX: 2,
      offsetY: 2,
      blur: 4,
    },
    maxWidth: 200,
    lineHeight: 20,
  }));

  return elements;
}

function gridlbTemplate(
  { lastFilms, columns, rows, param = null }: GridTemplateProps,
): {
  type: "grid";
  width: number;
  height: number;
  background: string;
  elements: CanvasElement[];
} {
  const config: Config = {
    POSTER_WIDTH: 230,
    POSTER_HEIGHT: 345,
    GRADIENT_HEIGHT: 200,
    ICON_SIZE: 23,
    ICON_MARGIN: 15,
    TEXT_PADDING: 15,
    TEXT_LINE_HEIGHT: 23,
    BOTTOM_TEXT_Y_OFFSET: 20,
    REGULAR_TEXT_Y_OFFSET: 45,
    TITLE_FONT_SIZE: 17,
    RATING_FONT_SIZE: 23,
  };

  const width = columns * config.POSTER_WIDTH;
  const height = rows * config.POSTER_HEIGHT + 60;

  const data = {
    type: "grid" as const,
    width,
    height,
    background: "#0E0E0E",
    elements: [] as CanvasElement[],
  };

  const watermark = generateWatermark(data);

  lastFilms.forEach((film, i) => {
    const posterElements = generatePosterData(film, i, columns, param, config);
    data.elements.push(...posterElements);
  });

  data.elements.push(...watermark);

  return data;
}

export default gridlbTemplate;
