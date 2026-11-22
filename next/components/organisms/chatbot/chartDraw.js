// Draws a chart the way the chat shows it: the website's theme and palette, the layout
// of `chartLayout.js`, and the choice between drawing it and showing a preview image.
//
// Nothing here depends on React, so the chatbot's eval page draws charts with this same
// code (`eval/charts/render_website_charts.py` in the chatbot repository). Keep it free
// of imports other than `./chartLayout`, and of names that module also declares.

import {
  SUBTITLE_FONT,
  TITLE_FONT,
  fitChart,
  measureDrawn,
  mergeConfig,
  wrapTitle,
} from "./chartLayout";

// Chart palette from design — single source of truth, don't hand-pick colors elsewhere.
// The two categorical sets are separate palettes, not one truncated into the other;
// `categoryPalette` chooses between them by the number of series the chart draws.
const BRAND_GREEN = "#2B8C4D"; // "1 color"
const CATEGORY_PALETTE_LOW = ["#2B8C4D", "#7EC876", "#42B0FF"]; // "2 or 3 colors"
const CATEGORY_PALETTE_HIGH = [
  "#7EC876",
  "#CA6FE0",
  "#FF8484",
  "#FBEA53",
  "#42B0FF",
  "#F358C8",
  "#F69E4C",
  "#61DCC6",
  "#8C564B",
  "#7F7F7F",
]; // "+3 colors"
// "1 color - gradient", light -> dark (low -> high magnitude).
const SEQUENTIAL_RAMP = ["#EAEAEA", "#CCEDC6", "#77C679", "#2B8C4D", "#004529"];

const CHART_CONFIG = {
  font: "Roboto",
  background: "transparent",
  axis: {
    labelColor: "#464A51",
    titleColor: "#252A32",
    gridColor: "#EEEEEE",
    domainColor: "#DEDFE0",
    tickColor: "#DEDFE0",
    labelFontSize: 11,
    titleFontSize: 12,
  },
  legend: {
    labelColor: "#464A51",
    titleColor: "#252A32",
    labelFontSize: 11,
    titleFontSize: 12,
  },
  title: {
    color: "#252A32",
    fontSize: TITLE_FONT.size,
    fontWeight: TITLE_FONT.weight,
    subtitleColor: "#71757A",
    subtitleFontSize: SUBTITLE_FONT.size,
    subtitleFontWeight: SUBTITLE_FONT.weight,
    anchor: "start",
  },
  view: { stroke: "transparent" },
  range: {
    category: CATEGORY_PALETTE_LOW, // replaced per chart (see `categoryPalette`)
    ordinal: SEQUENTIAL_RAMP,
    ramp: SEQUENTIAL_RAMP,
    heatmap: SEQUENTIAL_RAMP,
    // No `diverging`: design gave no diverging pair.
    // No `symbol` (the default for the `shape` channel, e.g. marker shapes): nothing here maps `shape`.
  },
  bar: { color: BRAND_GREEN },
  line: { color: BRAND_GREEN },
  area: { color: BRAND_GREEN },
  point: { color: BRAND_GREEN },
  circle: { color: BRAND_GREEN },
  arc: { fill: BRAND_GREEN },
};

// On a wide panel, the chart's download and expand buttons sit in a gutter this wide,
// right of the chart. On a narrow one the chart keeps that width, and they sit side by
// side over the right end of its title, which is wrapped short of them.
export const ACTIONS_GUTTER = 38;
const ACTIONS_ROW_WIDTH = 72;
const NARROW_PANEL = 480;

// Inline, a chart taller than this is shown as a preview: scrolling through it in the
// conversation would bury the messages around it.
const MAX_INLINE_HEIGHT = 1800;

// A preview is the chart scaled down to the panel, but never below this scale, past
// which its text is too small to make out; it is cropped instead.
const PREVIEW_MIN_SCALE = 0.5;
export const PREVIEW_MAX_HEIGHT = 420;

export class Cancelled extends Error {}

// The categorical palette for a drawn chart: the larger set when its color scale has more
// than 3 categories. Read from the drawn chart, so it counts the series the chart really
// shows, wherever its color encoding sits (a layer, small multiples, a computed label).
// A chart with no shared `color` scale, or a continuous one, keeps the default.
function categoryPalette(view) {
  try {
    const scale = view.scale("color");
    if (scale.type === "ordinal" && scale.domain().length > 3) return CATEGORY_PALETTE_HIGH;
  } catch {
    // Vega throws for a scale the chart does not have.
  }
  return CATEGORY_PALETTE_LOW;
}

export function titleText(title) {
  const text = title && typeof title === "object" && !Array.isArray(title) ? title.text : title;
  return (Array.isArray(text) ? text.join(" ") : text) || "grafico";
}

// Downloads a drawn chart as an image (`format` "png" or "svg"), named after its title.
export async function saveChart(view, format, title) {
  const link = document.createElement("a");
  link.href = await view.toImageURL(format);
  link.download = `${titleText(title)}.${format}`;
  link.click();
}

// Whether a panel this wide gives the chart the actions gutter (see `ACTIONS_GUTTER`).
export function isNarrowPanel(frameWidth) {
  return frameWidth < NARROW_PANEL;
}

// Draws `spec` into `container` for a panel `frameWidth` wide, as the chat shows it.
//
// `embed` is vega-embed's default export. `handle.embedded` always holds the chart left
// in `container`, so the caller can finalize it; `isCancelled` stops a draw whose result
// is no longer wanted. `embedOptions` adds to the website's own (e.g. a `loader`).
//
// Resolves to `{ status: "ready" }` once the chart is drawn, or, inline, for a chart
// that does not fit or is very tall, `{ status: "preview", preview: { url, width,
// height } }` with `container` emptied. Both also carry the layout's `kind`, `passes`,
// `fits` and drawn size.
export async function drawChart({
  embed,
  container,
  spec,
  frameWidth,
  expanded = false,
  handle = {},
  isCancelled = () => false,
  embedOptions = {},
}) {
  const narrow = isNarrowPanel(frameWidth);
  const width = narrow ? frameWidth : frameWidth - ACTIONS_GUTTER;
  // A single view fills its container, so the container is given the chart's width,
  // leaving the gutter free on a wide panel.
  container.style.width = `${width}px`;
  const titleWidth = narrow ? width - ACTIONS_ROW_WIDTH : width - 16;

  let palette = CATEGORY_PALETTE_LOW;
  // vega-embed's own actions menu is left out: the chat draws its own buttons beside the
  // chart (see `saveChart`).
  const options = { actions: false, renderer: "canvas", ...embedOptions };

  const clear = () => {
    handle.embedded?.finalize?.();
    handle.embedded = null;
    container.innerHTML = "";
  };

  const embedOnce = async (candidate) => {
    clear();
    const config = { ...CHART_CONFIG, range: { ...CHART_CONFIG.range, category: palette } };
    const result = await embed(
      container,
      {
        ...candidate,
        ...(candidate.title ? { title: wrapTitle(candidate.title, titleWidth) } : {}),
        config: mergeConfig(config, candidate.config),
      },
      options
    );
    if (isCancelled()) {
      result.finalize?.();
      throw new Cancelled();
    }
    handle.embedded = result;
    return result;
  };

  // The palette depends on how many series the chart draws, known once it is drawn: a
  // chart with more than 3 is drawn again, once, with the larger palette.
  const draw = async (candidate) => {
    let result = await embedOnce(candidate);
    const needed = categoryPalette(result.view);
    if (needed !== palette) {
      palette = needed;
      result = await embedOnce(candidate);
    }
    return measureDrawn(container);
  };

  const { drawn, fits, kind, passes } = await fitChart(spec, width, draw);
  const layout = { kind, passes, fits, drawn };

  if (expanded || (fits && drawn.height <= MAX_INLINE_HEIGHT)) {
    return { status: "ready", ...layout };
  }

  const scale = Math.min(1, Math.max(PREVIEW_MIN_SCALE, frameWidth / drawn.width));
  const url = await handle.embedded.view.toImageURL(
    "png",
    scale * (window.devicePixelRatio || 1)
  );
  if (isCancelled()) throw new Cancelled();
  clear();
  return {
    status: "preview",
    preview: {
      url,
      width: Math.round(drawn.width * scale),
      height: Math.round(drawn.height * scale),
    },
    ...layout,
  };
}
