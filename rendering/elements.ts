import type {
  CircleElement,
  GlassEffectOptions,
  ImageElement,
  RectangleElement,
  TextElement,
} from "./types";

export const DEFAULT_GLASS_OPTIONS: GlassEffectOptions = {
  light: {
    angle: -45,
    intensity: 0.55,
  },
  refraction: 2.5,
  depth: 5,
  dispersion: 0.5,
  frost: 1,
  tint: {
    color: "#000000",
    opacity: 0.15,
  },
  shadow: {
    color: "#000000",
    opacity: 0.1,
    blur: 10,
    offsetX: 2,
    offsetY: 2,
  },
};

export type CreateImageElementParams = Omit<ImageElement, "type">;

export function createImageElement(
  params: CreateImageElementParams,
): ImageElement {
  return {
    type: "image",
    ...params,
  };
}

export function createIconElement(
  params: CreateImageElementParams,
): ImageElement {
  return {
    type: "icon",
    ...params,
  };
}

export type CreateRectangleElementParams = Omit<RectangleElement, "type">;

export function createRectangleElement(
  params: CreateRectangleElementParams,
): RectangleElement {
  return {
    type: "rectangle",
    ...params,
  };
}

export type CreateCircleElementParams = Omit<CircleElement, "type">;

export function createCircleElement(
  params: CreateCircleElementParams,
): CircleElement {
  return {
    type: "circle",
    ...params,
  };
}

export type CreateTextElementParams = Omit<TextElement, "type">;

export function createTextElement(
  params: CreateTextElementParams,
): TextElement {
  return {
    type: "text",
    ...params,
  };
}

export type CreateGlassCircleParams = {
  cx: number;
  cy: number;
  diameter: number;
  options?: GlassEffectOptions;
  shadow?: CircleElement["shadow"];
  effects?: CircleElement["effects"];
};

export function createGlassCircleElement({
  cx,
  cy,
  diameter,
  options,
  shadow,
  effects,
}: CreateGlassCircleParams): CircleElement {
  return {
    type: "circle",
    x: cx,
    y: cy,
    width: diameter,
    height: diameter,
    shadow,
    effects,
    style: {
      type: "glass",
      options: {
        ...DEFAULT_GLASS_OPTIONS,
        ...options,
      },
    },
  };
}

export type CreateGlassPillParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  options?: GlassEffectOptions;
  shadow?: RectangleElement["shadow"];
  effects?: RectangleElement["effects"];
};

export function createGlassPillElement({
  x,
  y,
  width,
  height,
  options,
  shadow,
  effects,
}: CreateGlassPillParams): RectangleElement {
  return {
    type: "rectangle",
    x,
    y,
    width,
    height,
    borderRadius: height / 2,
    shadow,
    effects,
    style: {
      type: "glass",
      options: {
        ...DEFAULT_GLASS_OPTIONS,
        ...options,
      },
    },
  };
}

