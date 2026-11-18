// Draws a chart the way the chat shows it: the website's theme and palette, the layout
// of `chartLayout.js`, and the choice between drawing it and showing a preview image.
//
// Nothing here depends on React, so the chatbot's eval page draws charts with this same
// code (`eval/charts/render_website_charts.py` in the chatbot repository). Keep it free
// of imports other than `./chartLayout`, and of names that module also declares.

import {
  SUBTITLE_FONT,
  TITLE_FONT,
  collectRowArrays,
  fitChart,
  measureDrawn,
  mergeConfig,
  wrapTitle,
} from "./chartLayout";

// Chart palette from design — single source of truth, don't hand-pick colors elsewhere.
// The two categorical sets are separate palettes, not one truncated into the other;
// `pickCategoryPalette` chooses between them per render, based on series count.
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
    category: CATEGORY_PALETTE_LOW, // overridden per render by `pickCategoryPalette`
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

const EMBED_ACTIONS = {
  export: true,
  source: false,
  compiled: false,
  editor: false,
};

// On a wide panel, the actions menu and the expand button sit in a gutter this wide,
// right of the chart (vega-embed keeps it for its menu). On a narrow one the chart keeps
// that width, and they sit side by side over the right end of its title, which is
// wrapped short of them.
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

// First candidate encoding (top-level, or a layer's) with a nominal/ordinal `color` field.
// Returns the whole encoding, not just `.color`, so callers can also read `.detail`.
//
// Edge case: assumes one shared color scale for the chart. `resolve: {scale: {color:
// "independent"}}` lets layers use unrelated color fields with separate legends — unhandled,
// since nothing here emits that; would need a palette per scale, not one global category range.
function findColorEncoding(spec) {
  const candidates = [spec.encoding, ...(spec.layer || []).map((layer) => layer.encoding)];
  return candidates.find(
    (encoding) => encoding?.color?.field && ["nominal", "ordinal"].includes(encoding.color.type)
  );
}

// Distinct values of `field` in the raw rows. Returns null (not 0) when the field isn't
// found there, so callers can fall back to another field instead of reading it as zero series.
function distinctRawValues(rows, field) {
  if (!field) return null;
  const distinct = new Set(rows.map((row) => row?.[field]));
  distinct.delete(undefined);
  distinct.delete(null);
  return distinct.size || null;
}

// Real series count, for `pickCategoryPalette`. Null means no categorical color (a
// single-series chart, or color mapped to a quantitative field).
//
// Fall back to `detail.field` when `color.field` is a `calculate`-derived label absent from
// the raw rows. Each field is tried across every row array, since the color field may sit in
// a different source than the top-level data (e.g. a choropleth's lookup transform).
function countColorSeries(spec) {
  const encoding = findColorEncoding(spec);
  if (!encoding) return null;

  const rowArrays = collectRowArrays(spec);
  const detail = Array.isArray(encoding.detail) ? encoding.detail[0] : encoding.detail;

  for (const field of [encoding.color.field, detail?.field]) {
    for (const rows of rowArrays) {
      const count = distinctRawValues(rows, field);
      if (count !== null) return count;
    }
  }

  return null;
}

function pickCategoryPalette(spec) {
  const seriesCount = countColorSeries(spec);
  if (seriesCount === null) return CATEGORY_PALETTE_LOW;
  return seriesCount > 3 ? CATEGORY_PALETTE_HIGH : CATEGORY_PALETTE_LOW;
}

export function titleText(title) {
  const text = title && typeof title === "object" && !Array.isArray(title) ? title.text : title;
  return (Array.isArray(text) ? text.join(" ") : text) || "grafico";
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
  const titleWidth = narrow ? width - ACTIONS_ROW_WIDTH : width - 16;

  const chartConfig = {
    ...CHART_CONFIG,
    range: { ...CHART_CONFIG.range, category: pickCategoryPalette(spec) },
  };
  const options = {
    actions: EMBED_ACTIONS,
    renderer: "canvas",
    downloadFileName: titleText(spec.title),
    ...embedOptions,
  };

  const clear = () => {
    handle.embedded?.finalize?.();
    handle.embedded = null;
    container.innerHTML = "";
  };

  const draw = async (candidate) => {
    clear();
    const result = await embed(
      container,
      {
        ...candidate,
        ...(candidate.title ? { title: wrapTitle(candidate.title, titleWidth) } : {}),
        config: mergeConfig(chartConfig, candidate.config),
      },
      options
    );
    if (isCancelled()) {
      result.finalize?.();
      throw new Cancelled();
    }
    handle.embedded = result;
    return measureDrawn(container, result.view);
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
