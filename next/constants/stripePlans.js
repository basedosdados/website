// The exact Stripe prices the site sells, selected by their stable Stripe price id ("price_…",
// verifiable in the Stripe dashboard). Selecting by id is robust to other active prices existing
// on the same product — legacy tiers, gift prices, and the per-currency prices added for the
// international rollout.
//
// The ids below anchor each plan to its consumer (BRL) price. On the international domains the
// site shows the same plan in the visitor's currency by swapping to the price that carries the
// matching `region` tag (same product and interval) — see selectPlans. This mirrors the backend
// checkout webhook, which charges the region-correct price from the card's country, so what the
// visitor sees is what they are charged.
//
// The ids below are the production Stripe account's (staging shares the same account). Any
// environment on a different Stripe account can override them via NEXT_PUBLIC_STRIPE_PRICE_IDS,
// a JSON object keyed by the same plan keys.

export const PLAN_KEYS = [
  "bd_pro_month",
  "bd_pro_year",
  "bd_chatbot_month",
  "bd_chatbot_year",
]

// The three pricing regions, tagged on each Stripe price via its `region` metadata:
//   br    — Brazil, in BRL (the anchor prices below)
//   latam — Spanish-speaking Latin America, in USD
//   intl  — the rest of the world, in USD
const DEFAULT_REGION = "br"

const DEFAULT_PRICE_IDS = {
  bd_pro_month: "price_1OcrtHCKkCLMrYWYcxJtHMMa", // BD Pro — R$47/month
  bd_pro_year: "price_1PWlKQCKkCLMrYWYxV3xodMC", // BD Pro — R$444/year
  bd_chatbot_month: "price_1TCkdbCKkCLMrYWYFgOfi2cc", // Chatbot — R$30/month
  bd_chatbot_year: "price_1TCkdwCKkCLMrYWYXQlflpIn", // Chatbot — R$326/year
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
 * br bills in BRL; latam and intl bill in USD. USD is formatted en-US ("$19.00")
 * and BRL pt-BR ("R$ 47,00").
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
 * Returns undefined for a nullish amount, preserving the `amount?.toLocaleString(...)`
 * semantics of the call sites this replaces (which render nothing until the amount loads).
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

function priceIds() {
  let overrides = {}
  try {
    overrides = JSON.parse(process.env.NEXT_PUBLIC_STRIPE_PRICE_IDS || "{}")
  } catch (e) {
    console.error("Invalid NEXT_PUBLIC_STRIPE_PRICE_IDS JSON; ignoring it.", e)
  }
  return { ...DEFAULT_PRICE_IDS, ...overrides }
}

/**
 * Resolve the plan nodes the site sells from the getPlans edges.
 *
 * Each plan is anchored to its BRL price by exact Stripe price id. For a non-BR region, the
 * anchor is swapped for the sibling price that carries the matching `region` tag and the same
 * product (`productSlug`) and `interval`. When no such sibling exists (or the region is br), the
 * BRL anchor is shown. This keeps id-based selection as the source of truth while adding the
 * currency dimension, and never shows a price for the wrong product or interval.
 *
 * @param {Array<{node: object}>} edges - getPlans result data (array of { node }).
 * @param {"br"|"latam"|"intl"} [region="br"] - pricing region for the current domain.
 * @returns {Record<string, object|undefined>} plan-key -> price node (undefined if the
 *   configured id isn't among the active prices returned by getPlans).
 */
export function selectPlans(edges = [], region = DEFAULT_REGION) {
  const ids = priceIds()
  const plans = {}

  for (const key of PLAN_KEYS) {
    const wantedId = ids[key]
    const anchor = edges.find(({ node }) => node.stripePriceId === wantedId)

    if (!anchor) {
      console.warn(
        `Stripe price "${key}" (${wantedId}) not found among active prices from getPlans — ` +
          "check the id and that the price is active."
      )
      plans[key] = undefined
      continue
    }

    if (region === DEFAULT_REGION) {
      plans[key] = anchor.node
      continue
    }

    // Swap to the regional sibling: same product and interval, tagged for this region.
    const sibling = edges.find(
      ({ node }) =>
        node.region === region &&
        node.productSlug === anchor.node.productSlug &&
        node.interval === anchor.node.interval
    )

    if (!sibling) {
      console.warn(
        `No "${region}" price for plan "${key}" (${anchor.node.productSlug}/${anchor.node.interval}); ` +
          "showing the BRL price. Add the regional price in Stripe with the matching `region` tag."
      )
    }

    plans[key] = (sibling ?? anchor).node
  }

  return plans
}
