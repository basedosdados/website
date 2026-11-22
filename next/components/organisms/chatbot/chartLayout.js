// Lays a chart out for the width it is shown at.
//
// Vega-Lite fits only a single or layered view to its container. Small multiples and
// concatenations keep the sizes they were given, so a chart written for one width runs
// off a narrower panel or leaves a wider one half empty. Here the website chooses those
// sizes itself: how many columns of panels, how wide each panel is, where the legend
// goes. It then draws the chart, measures it, and corrects the sizes until it fits.
//
// Nothing here depends on React, so it can be checked in a plain page.

// Small multiples: as many columns are laid out as fit panels about the target width,
// and a panel is never made narrower than the minimum (the chart needs fewer columns
// instead). The panels then share the whole width, as a single chart fills it.
const PANEL_TARGET_WIDTH = 220;
const PANEL_MIN_WIDTH = 140;
// A panel with a continuous y axis is this many times as tall as it is wide.
const PANEL_ASPECT = 0.75;
const PANEL_MIN_HEIGHT = 120;
const PANEL_MAX_HEIGHT = 300;

// First guesses at what a chart takes beside its panels, corrected once it is drawn.
const AXIS_ALLOWANCE = 64;
const LEGEND_ALLOWANCE = 140;
// Vega-Lite's default space between panels and between concatenated views.
const SPACING = 20;

// Below this width, legends go under the chart: beside it they take the room the plot
// or the panels need.
const COMPACT_WIDTH = 480;

// A single view fitted on its width alone grows to hold every mark, so marks drawn far
// outside their scale (a fixed domain narrower than the values) can make it this tall
// or more. It is then fitted on both sides, which keeps it at its height.
const MAX_FIT_X_HEIGHT = 10000;

// Width of one entry of a legend under the chart, which lays its entries in columns.
const LEGEND_ENTRY_WIDTH = 150;

// How many times a chart may be drawn while its sizes are corrected.
const MAX_FIT_PASSES = 4;

// A chart that fits may still leave room. Its panels grow when they would gain at least
// this many pixels each.
const MIN_PANEL_GROWTH = 12;

const COMPOSITE_KEYS = ["facet", "repeat", "vconcat", "hconcat", "concat"];
const CONCAT_KEYS = ["vconcat", "hconcat", "concat"];
const LEGEND_CHANNELS = ["color", "fill", "stroke", "size", "shape", "opacity", "strokeDash"];

// The keys of a unit or layer spec that describe one view. Turning a facet channel into a
// facet operator moves them into the operator's `spec`; the rest (data, transforms,
// title, config, ...) stays outside.
const VIEW_KEYS = ["mark", "layer", "encoding", "projection", "params", "width", "height", "view"];

// Layout properties a facet channel carries that a facet operator takes beside `facet`.
const FACET_LAYOUT_KEYS = ["columns", "spacing", "align", "center", "bounds"];

const PAD = { type: "pad" };

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function mergeConfig(base, override) {
  if (!isObject(override)) {
    return override === undefined ? base : override;
  }
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] = isObject(current) && isObject(value) ? mergeConfig(current, value) : value;
  }
  return out;
}

function isComposite(view) {
  return isObject(view) && COMPOSITE_KEYS.some((key) => view[key]);
}

function positiveInteger(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
}

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}

function omit(object, keys) {
  return Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)));
}

// Every encoding in the spec: top-level, a layer's (nested too), a concatenated view's,
// and a facet's inner spec.
function collectEncodings(node, out = []) {
  if (!isObject(node)) return out;
  if (isObject(node.encoding)) out.push(node.encoding);
  for (const key of ["layer", ...CONCAT_KEYS]) {
    if (Array.isArray(node[key])) node[key].forEach((view) => collectEncodings(view, out));
  }
  if (isObject(node.spec)) collectEncodings(node.spec, out);
  return out;
}

// Every inline row array in the spec. Not just `spec.data.values`: a choropleth's rows live
// in its lookup transform's `from.data.values`, since its top-level `data` is the geometry.
function collectRowArrays(node, out = []) {
  if (Array.isArray(node)) {
    node.forEach((item) => collectRowArrays(item, out));
  } else if (isObject(node)) {
    // Guard on row-like objects so an axis/legend `values` (tick values) isn't taken for data.
    if (Array.isArray(node.values) && node.values.some((value) => isObject(value))) {
      out.push(node.values);
    }
    Object.values(node).forEach((value) => collectRowArrays(value, out));
  }
  return out;
}

// How many distinct values a column holds in the spec's rows, or null when the field is
// not one of their columns (e.g. it is computed by a transform).
function distinctCount(spec, field) {
  if (typeof field !== "string") return null;
  for (const rows of collectRowArrays(spec)) {
    const values = new Set(rows.map((row) => row?.[field]));
    values.delete(undefined);
    if (values.size) return values.size;
  }
  return null;
}

function hasLegend(spec) {
  return collectEncodings(spec).some((encoding) =>
    LEGEND_CHANNELS.some((channel) => {
      const definition = encoding[channel];
      return (
        isObject(definition) &&
        (definition.field !== undefined || definition.datum !== undefined) &&
        definition.legend !== null
      );
    })
  );
}

function markTypes(view, out = []) {
  if (!isObject(view)) return out;
  if (view.mark) out.push(isObject(view.mark) ? view.mark.type : view.mark);
  if (Array.isArray(view.layer)) view.layer.forEach((layer) => markTypes(layer, out));
  return out;
}

// A map or a pie reads best about as tall as it is wide.
function isRound(view) {
  return (
    Boolean(view.projection) ||
    markTypes(view).some((type) => type === "geoshape" || type === "arc")
  );
}

// A view whose y axis is a set of categories takes its height from their number.
function hasDiscreteY(view) {
  return collectEncodings(view).some((encoding) =>
    ["nominal", "ordinal"].includes(encoding.y?.type)
  );
}

// Width and height for one panel of small multiples or one concatenated view. A map or a
// pie is as tall as it is wide. Otherwise a height the spec gives is kept, and so is the
// height of a y axis that lists categories, which its bands decide; any other height
// follows the width.
function sizePanel(view, width) {
  if (isComposite(view)) return view;
  if (isRound(view)) return { ...view, width, height: width };
  if (typeof view.height === "number" || hasDiscreteY(view)) return { ...view, width };
  const height = clamp(Math.round(width * PANEL_ASPECT), PANEL_MIN_HEIGHT, PANEL_MAX_HEIGHT);
  return { ...view, width, height };
}

// A concatenated view is sized as a panel, and its own title is wrapped to it, as a long
// one would widen the whole chart.
function sizeConcatView(view, width) {
  const sized = sizePanel(view, width);
  return view.title ? { ...sized, title: wrapTitle(view.title, width + AXIS_ALLOWANCE) } : sized;
}

// Applies `rewrite` to every encoding of a spec, wherever it sits.
function mapEncodings(node, rewrite) {
  if (!isObject(node)) return node;
  const out = { ...node };
  if (isObject(node.encoding)) out.encoding = rewrite(node.encoding);
  for (const key of ["layer", ...CONCAT_KEYS]) {
    if (Array.isArray(node[key])) out[key] = node[key].map((view) => mapEncodings(view, rewrite));
  }
  if (isObject(node.spec)) out.spec = mapEncodings(node.spec, rewrite);
  return out;
}

// Puts every legend the spec does not place elsewhere under the chart, its entries in
// as many columns as fit the width.
function legendsBelow(spec, width) {
  const placement = {
    orient: "bottom",
    direction: "horizontal",
    columns: Math.max(1, Math.floor((width - 24) / LEGEND_ENTRY_WIDTH)),
    labelLimit: LEGEND_ENTRY_WIDTH - 40,
  };
  return mapEncodings(spec, (encoding) => {
    const out = { ...encoding };
    for (const channel of LEGEND_CHANNELS) {
      const definition = encoding[channel];
      if (!isObject(definition) || definition.legend === null) continue;
      const legend = isObject(definition.legend) ? definition.legend : {};
      if (legend.orient && legend.orient !== "bottom") continue;
      // Its layout is chosen here, over the spec's: a width or columns set for a legend
      // beside the chart do not fit under it.
      out[channel] = { ...definition, legend: { ...legend, ...placement } };
    }
    return out;
  });
}

// Config for a narrow screen, under the spec's own.
function compactConfig(width) {
  return {
    // Long category names take the room of the bars beside them.
    axisY: { labelLimit: Math.min(180, Math.round(width * 0.35)) },
    // Labels that would overlap, such as a year under each of many narrow bars, are
    // thinned out instead of drawn over one another.
    axis: { labelOverlap: true },
    // Several legends under the chart stack, rather than line up side by side.
    legend: { layout: { bottom: { anchor: "start", direction: "vertical" } } },
  };
}

// A spec laid out for a narrow screen: legends below and the compact config.
function compactSpec(spec, width) {
  return { ...legendsBelow(spec, width), config: mergeConfig(compactConfig(width), spec.config) };
}

// Small multiples written as encoding channels (`facet`, `row`, `column`), as the
// equivalent facet operator: the channels go in `facet`, the view they repeat in `spec`.
function facetOperator(spec) {
  const encoding = spec.encoding;
  if (isComposite(spec) || !isObject(encoding)) return spec;
  const { row, column, facet, ...rest } = encoding;
  if (!isObject(row) && !isObject(column) && !isObject(facet)) return spec;

  const outer = {};
  const inner = {};
  for (const [key, value] of Object.entries(spec)) {
    (VIEW_KEYS.includes(key) ? inner : outer)[key] = value;
  }
  inner.encoding = rest;

  if (isObject(facet)) {
    const layout = Object.fromEntries(
      FACET_LAYOUT_KEYS.filter((key) => facet[key] !== undefined).map((key) => [key, facet[key]])
    );
    return { ...outer, ...layout, facet: omit(facet, FACET_LAYOUT_KEYS), spec: inner };
  }
  const channels = { ...(row ? { row } : {}), ...(column ? { column } : {}) };
  return { ...outer, facet: channels, spec: inner };
}

// Small multiples split by `column` alone lay every panel out in one row, and by `row`
// alone in one column, however many there are. Both become a wrapped facet, whose number
// of columns is then chosen for the width; panels split by `row` stay one under another.
function wrapFacet(spec) {
  const operator = facetOperator(spec);
  if (!isObject(operator.facet) || !isObject(operator.spec)) return operator;
  const { row, column } = operator.facet;
  if (column && !row) return { ...operator, facet: column };
  if (row && !column) return { ...operator, facet: row, columns: 1 };
  return operator;
}

// A single or layered view: Vega-Lite fits it to the container's width.
//
// On a narrow screen its legends go under it, and only its width is fitted (`fit-x`), so
// a legend under it adds to its height rather than squeezing the plot. A map or a pie
// there is also no taller than it is wide: the shape, about as tall as it is wide, would
// leave the rest of a taller box empty.
function singlePlan(spec, width) {
  const compact = width < COMPACT_WIDTH;
  let height = spec.height;
  if (compact && isRound(spec)) {
    height = Math.min(typeof spec.height === "number" ? spec.height : width, width);
  }
  return {
    kind: "single",
    initial: { fitX: compact },
    build: ({ fitX }) => ({
      ...(compact ? compactSpec(spec, width) : spec),
      width: "container",
      ...(height !== undefined ? { height } : {}),
      autosize: {
        contains: "padding",
        ...(isObject(spec.autosize) ? spec.autosize : {}),
        type: fitX ? "fit-x" : "fit",
      },
    }),
    fits: (drawn) => drawn.width <= width + 1,
    adjust: (state, drawn) =>
      state.fitX && drawn.height > MAX_FIT_X_HEIGHT ? { fitX: false } : null,
  };
}

// A chart whose layout is not chosen here (a repeat, nested compositions): drawn at the
// sizes it gives, and shown some other way when it does not fit.
function naturalPlan(spec, width) {
  return {
    kind: "natural",
    initial: {},
    build: () => ({ ...spec, autosize: PAD }),
    fits: (drawn) => drawn.width <= width + 1,
    adjust: () => null,
  };
}

// Panels in a grid of columns. `build` lays the chart out for a number of columns and a
// panel width; once it is drawn, the room taken by everything but the panels is measured
// and the panels resized to what is left.
//
// `perColumnOverhead` says where that room goes: a concatenated view carries its own
// axes, so it repeats in every column; a facet shares one axis per row.
function gridPlan({ kind, width, minColumns, maxColumns, legendAllowance, perColumnOverhead, build }) {
  const panelWidth = (columns, overhead) =>
    Math.floor(
      (width - (perColumnOverhead ? columns * overhead : overhead) - (columns - 1) * SPACING) /
        columns
    );

  const guess = perColumnOverhead ? AXIS_ALLOWANCE : AXIS_ALLOWANCE + legendAllowance;
  let columns = clamp(
    Math.round((width - guess + SPACING) / (PANEL_TARGET_WIDTH + SPACING)),
    minColumns,
    maxColumns
  );
  while (columns > minColumns && panelWidth(columns, guess) < PANEL_MIN_WIDTH) columns -= 1;

  return {
    kind,
    initial: { columns, panel: Math.max(PANEL_MIN_WIDTH, panelWidth(columns, guess)) },
    build,
    fits: (drawn) => drawn.width <= width + 1,
    adjust: (state, drawn) => {
      const panels = state.columns * state.panel + (state.columns - 1) * SPACING;
      const overhead = perColumnOverhead
        ? (drawn.width - panels) / state.columns
        : drawn.width - panels;

      if (drawn.width <= width + 1) {
        const room = panelWidth(state.columns, overhead);
        return room - state.panel >= MIN_PANEL_GROWTH ? { ...state, panel: room } : null;
      }

      let next = state.columns;
      let panel = panelWidth(next, overhead);
      while (next > minColumns && panel < PANEL_MIN_WIDTH) {
        next -= 1;
        panel = panelWidth(next, overhead);
      }
      return panel < PANEL_MIN_WIDTH ? null : { columns: next, panel };
    },
  };
}

// A facet with its panels sized. A panel's header label longer than the panel is cut
// short, as it would otherwise widen its column past the panel.
function sizeFacet(spec, panel) {
  return {
    ...spec,
    spec: sizePanel(spec.spec, panel),
    config: mergeConfig({ header: { labelLimit: panel + SPACING } }, spec.config),
  };
}

// Small multiples in a wrapped facet, in as many columns as fit. The spec's own `columns`
// is an upper bound: fewer may be chosen for a narrow panel, never more, as a single
// column may be what was asked for. A grid of rows by columns has a column per value of
// its column field, so it is drawn at its own sizes.
function facetPlan(spec, width, legendAllowance) {
  if (spec.facet.row || spec.facet.column) return naturalPlan(spec, width);

  const count = distinctCount(spec, spec.facet.field) ?? Infinity;
  const maxColumns = Math.max(1, Math.min(count, positiveInteger(spec.columns) ?? Infinity));
  return gridPlan({
    kind: "facet",
    width,
    minColumns: 1,
    maxColumns: Number.isFinite(maxColumns) ? maxColumns : 6,
    legendAllowance,
    perColumnOverhead: false,
    build: ({ columns, panel }) => ({ ...sizeFacet(spec, panel), columns }),
  });
}

function concatPlan(spec, width, legendAllowance) {
  const key = CONCAT_KEYS.find((name) => Array.isArray(spec[name]));
  const views = spec[key];
  const maxColumns = {
    vconcat: 1,
    hconcat: views.length,
    concat: Math.min(positiveInteger(spec.columns) ?? views.length, views.length),
  }[key];

  return gridPlan({
    kind: key,
    width,
    minColumns: 1,
    maxColumns,
    legendAllowance,
    perColumnOverhead: true,
    build: ({ columns, panel }) => {
      const sized = views.map((view) => sizeConcatView(view, panel));
      if (key === "vconcat" || (key === "hconcat" && columns === views.length)) {
        return { ...spec, [key]: sized };
      }
      // Views side by side that do not fit wrap onto more rows.
      return { ...omit(spec, [key]), concat: sized, columns };
    },
  });
}

// Chooses how a chart is laid out for a width: what is sized here, and how.
function planLayout(rawSpec, width) {
  const spec = wrapFacet(rawSpec);
  if (!isComposite(spec)) return singlePlan(spec, width);

  // A composition is sized by its views, not as a whole, and is never stretched to the
  // container: its size is the sum of theirs.
  const compact = width < COMPACT_WIDTH;
  const base = {
    ...omit(compact ? compactSpec(spec, width) : spec, ["width", "height"]),
    autosize: PAD,
  };
  const legendAllowance = !compact && hasLegend(spec) ? LEGEND_ALLOWANCE : 0;

  if (isObject(base.facet) && isObject(base.spec) && !isComposite(base.spec)) {
    return facetPlan(base, width, legendAllowance);
  }
  if (CONCAT_KEYS.some((key) => Array.isArray(base[key]))) {
    return concatPlan(base, width, legendAllowance);
  }
  return naturalPlan(base, width);
}

// The fonts of a chart's title and subtitle, which the theme sets, for wrapping them.
export const TITLE_FONT = { size: 15, weight: 600 };
export const SUBTITLE_FONT = { size: 12, weight: 400 };

let measureContext = null;

function measureText(text, font) {
  if (!measureContext) measureContext = document.createElement("canvas").getContext("2d");
  measureContext.font = `${font.weight} ${font.size}px Roboto, sans-serif`;
  return measureContext.measureText(text).width;
}

// Vega titles do not wrap, so a long one runs off the chart, and widens a composition
// to its own length. Break it into lines that fit `maxWidth`; Vega draws an array of
// strings as one line each.
function wrapLines(text, font, maxWidth) {
  if (typeof text !== "string" || maxWidth <= 0) return text;
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && measureText(candidate, font) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.length > 1 ? lines : text;
}

export function wrapTitle(title, maxWidth) {
  if (!title) return title;
  const params = isObject(title) ? title : { text: title };
  const wrapped = { ...params, text: wrapLines(params.text, TITLE_FONT, maxWidth) };
  if (params.subtitle) wrapped.subtitle = wrapLines(params.subtitle, SUBTITLE_FONT, maxWidth);
  return wrapped;
}

// The size a drawn chart takes on the page.
export function measureDrawn(container) {
  const marks = container.querySelector(".marks");
  const rect = marks ? marks.getBoundingClientRect() : { width: 0, height: 0 };
  return { width: rect.width, height: rect.height };
}

// Lays a chart out for `width`, drawing it with `draw` (which embeds a spec and resolves
// to `measureDrawn`'s result) and correcting the sizes until it fits or cannot.
//
// Resolves to the spec drawn last, which is the one left on the page, its size, whether
// it fits, the kind of layout, and how many times it was drawn.
export async function fitChart(spec, width, draw) {
  const plan = planLayout(spec, width);
  let state = plan.initial;
  let fitting = null;
  let last = null;
  let passes = 0;

  while (passes < MAX_FIT_PASSES) {
    const candidate = plan.build(state);
    const drawn = await draw(candidate);
    passes += 1;
    last = { spec: candidate, drawn, fits: plan.fits(drawn) };
    if (last.fits) fitting = last;
    const next = plan.adjust(state, drawn);
    if (!next) break;
    state = next;
  }

  // Growing a chart that fitted can overshoot; go back to the last layout that fitted.
  if (!last.fits && fitting) {
    const drawn = await draw(fitting.spec);
    passes += 1;
    last = { ...fitting, drawn, fits: plan.fits(drawn) };
  }
  return { ...last, kind: plan.kind, passes };
}
