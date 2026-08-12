// The Stripe prices the site sells are identified by three explicit fields — the product's
// `code` metadata (exposed as `productSlug`), the price's billing `interval`, and the price's
// `region` metadata ("br" | "latam" | "intl") — instead of by amount (ambiguous: BD Pro LatAm and
// International both bill in USD but at different amounts, and amounts change on repricing) or by
// pinning a hardcoded Stripe price id (breaks across Stripe accounts/modes, e.g. staging's test
// mode has different — or missing — ids than production's live mode).
//
// `region` must be set as metadata on each Stripe Price object (both live mode and test mode) for
// this matching to work. A price missing that metadata simply won't be selected, logging a warning
// instead of silently showing the wrong plan.
//
// Currency follows the domain (see localeToRegion / regionCurrency): basedosdados.org bills BRL,
// data-basis.org and basedelosdatos.org bill USD.

export const PLAN_KEYS = [
  "bd_pro_month",
  "bd_pro_year",
  "bd_chatbot_month",
  "bd_chatbot_year",
]

// The three pricing regions the site sells in.
const DEFAULT_REGION = "br"

// Plan key -> the productSlug + interval that identify it, region-independent.
export const planFilters = {
  bd_pro_month: { productSlug: "bd_pro", interval: "month" },
  bd_pro_year: { productSlug: "bd_pro", interval: "year" },
  bd_chatbot_month: { productSlug: "chatbot", interval: "month" },
  bd_chatbot_year: { productSlug: "chatbot", interval: "year" },
}

/**
 * Map the site locale (domain) to a pricing region.
 *
 * basedosdados.org (pt) → br, basedelosdatos.org (es) → latam, data-basis.org (en) → intl.
 * Anything unknown falls back to the BRL region, the site's historical behavior.
 *
 * @param {string|undefined} locale - next-i18next locale for the current domain.
 * @returns {"br"|"latam"|"intl"} the pricing region.
 */
export function localeToRegion(locale) {
  switch (locale) {
    case "en":
      return "intl"
    case "es":
      return "latam"
    case "pt":
      return "br"
    default:
      return DEFAULT_REGION
  }
}

/**
 * Currency presentation for a pricing region.
 *
 * br bills in BRL; latam and intl bill in USD. USD is formatted en-US ("$19.00") and BRL pt-BR
 * ("R$ 47,00").
 *
 * @param {"br"|"latam"|"intl"} region
 * @returns {{code: string, locale: string, symbol: string}}
 */
export function regionCurrency(region) {
  switch (region) {
    case "intl":
    case "latam":
      return { code: "USD", locale: "en-US", symbol: "$" }
    case "br":
    default:
      return { code: "BRL", locale: "pt-BR", symbol: "R$" }
  }
}

/**
 * Format a numeric amount in the currency of a pricing region.
 *
 * Returns undefined for a nullish amount, preserving the `amount?.toLocaleString(...)` semantics of
 * the call sites this replaces (which render nothing until the amount loads).
 *
 * @param {number|undefined|null} amount
 * @param {"br"|"latam"|"intl"} region
 * @param {{minimumFractionDigits?: number}} [opts]
 * @returns {string|undefined}
 */
export function formatCurrency(amount, region, { minimumFractionDigits = 2 } = {}) {
  if (amount === null || amount === undefined) return undefined
  const { code, locale } = regionCurrency(region)
  return amount.toLocaleString(locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits,
  })
}

/**
 * Find the single active price matching a productSlug + interval + region combination among the
 * getPlans edges.
 *
 * Logs a warning and returns undefined if no price matches (metadata missing or price inactive).
 * Logs a warning and returns the first match if more than one price matches (duplicate/misconfigured
 * region metadata in the Stripe dashboard) rather than picking arbitrarily without surfacing it.
 *
 * @param {Array<{node: object}>} edges - getPlans result data (array of { node }).
 * @param {{productSlug: string, interval: string}} filter
 * @param {"br"|"latam"|"intl"} region
 * @param {string} label - identifies the plan in warning messages (e.g. "bd_pro_month").
 * @returns {object|undefined} the matching price node, if exactly one (or the first of several).
 */
export function findPlan(edges, { productSlug, interval }, region, label) {
  const wantedSlug = productSlug?.toLowerCase()
  const wantedInterval = interval?.toLowerCase()
  const wantedRegion = region?.toLowerCase()

  const matches = edges.filter(({ node }) => {
    return (
      node.productSlug?.toLowerCase() === wantedSlug &&
      node.interval?.toLowerCase() === wantedInterval &&
      node.region?.toLowerCase() === wantedRegion
    )
  })

  if (matches.length === 0) {
    console.warn(
      `Stripe price "${label}" for region "${region}" not found among active prices from ` +
        "getPlans — check that a price has productSlug/interval/region metadata matching and is active."
    )
    return undefined
  }

  if (matches.length > 1) {
    console.warn(
      `Stripe price "${label}" for region "${region}" matched ${matches.length} active prices — ` +
        "check for duplicate region metadata in the Stripe dashboard. Using the first match."
    )
  }

  return matches[0].node
}

/**
 * Resolve the plan nodes the site sells from the getPlans edges, by productSlug + interval +
 * region.
 *
 * @param {Array<{node: object}>} edges - getPlans result data (array of { node }).
 * @param {"br"|"latam"|"intl"} [region="br"] - pricing region for the current domain.
 * @returns {Record<string, object|undefined>} plan key → price node (undefined if not found).
 */
export function selectPlans(edges = [], region = DEFAULT_REGION) {
  const plans = {}

  for (const key of PLAN_KEYS) {
    plans[key] = findPlan(edges, planFilters[key], region, key)
  }

  return plans
}
