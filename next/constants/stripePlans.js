// The exact Stripe prices the site sells, pinned by their stable Stripe price id ("price_…",
// verifiable in the Stripe dashboard) for each plan AND region. Selecting by id is deterministic:
// a new, edited, or mis-tagged price in Stripe is simply ignored until its id is added here and the
// site is redeployed. Nothing is inferred from price metadata, amounts, or intervals.
//
// Only the *selection* is pinned. The amount shown for each plan still comes live from the getPlans
// GraphQL query, so a price change in Stripe reflects on the site automatically; only adding or
// swapping which price is sold requires updating this map and redeploying.
//
// Currency follows the domain (see localeToRegion / regionCurrency): basedosdados.org bills BRL,
// data-basis.org and basedelosdatos.org bill USD. The backend checkout webhook independently
// enforces the region-correct price from the card's country (arbitrage guard), so what the visitor
// sees here is what they are charged.
//
// The ids below are the production Stripe account's (staging shares the same account). Any
// environment on a different Stripe account can override them via NEXT_PUBLIC_STRIPE_PRICE_IDS,
// a JSON object shaped like DEFAULT_PRICE_IDS below (keyed by region, then plan key).

export const PLAN_KEYS = [
  "bd_pro_month",
  "bd_pro_year",
  "bd_chatbot_month",
  "bd_chatbot_year",
]

// The three pricing regions the site sells in.
const DEFAULT_REGION = "br"

// Exact price id per region and plan. Amounts in the comments are for human reference only —
// the live amount is read from getPlans, never from here.
const DEFAULT_PRICE_IDS = {
  br: {
    bd_pro_month: "price_1OcrtHCKkCLMrYWYcxJtHMMa", // BD Pro — R$47/month
    bd_pro_year: "price_1PWlKQCKkCLMrYWYxV3xodMC", // BD Pro — R$444/year
    bd_chatbot_month: "price_1TCkdbCKkCLMrYWYFgOfi2cc", // Chatbot — R$30/month
    bd_chatbot_year: "price_1TCkdwCKkCLMrYWYXQlflpIn", // Chatbot — R$326/year
  },
  latam: {
    bd_pro_month: "price_1U0yCrCKkCLMrYWY2piPpKCg", // BD Pro — US$12/month
    bd_pro_year: "price_1U0yE4CKkCLMrYWYsVrOB3i5", // BD Pro — US$115/year
    bd_chatbot_month: "price_1U0yJSCKkCLMrYWYj2DSeGa8", // Chatbot — US$8/month
    bd_chatbot_year: "price_1U0yJtCKkCLMrYWYOs7xvfpL", // Chatbot — US$77/year
  },
  intl: {
    bd_pro_month: "price_1U0dw1CKkCLMrYWYUkFlGyHA", // BD Pro — US$19/month
    bd_pro_year: "price_1U0yBTCKkCLMrYWYDXo7NRwV", // BD Pro — US$180/year
    bd_chatbot_month: "price_1U0yHZCKkCLMrYWYR4KtKTSQ", // Chatbot — US$15/month
    bd_chatbot_year: "price_1U0yIGCKkCLMrYWYrE2FzOLt", // Chatbot — US$144/year
  },
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
 * Resolve the pinned price ids for a region, applying any environment override.
 *
 * NEXT_PUBLIC_STRIPE_PRICE_IDS, when set, is a JSON object shaped like DEFAULT_PRICE_IDS
 * (region → plan key → id). Only the given region's entries override; the rest fall back to the
 * defaults above.
 *
 * @param {"br"|"latam"|"intl"} region
 * @returns {Record<string, string>} plan key → Stripe price id for this region.
 */
function priceIds(region) {
  let overrides = {}
  try {
    overrides = JSON.parse(process.env.NEXT_PUBLIC_STRIPE_PRICE_IDS || "{}")
  } catch (e) {
    console.error("Invalid NEXT_PUBLIC_STRIPE_PRICE_IDS JSON; ignoring it.", e)
  }
  return { ...DEFAULT_PRICE_IDS[region], ...(overrides[region] || {}) }
}

/**
 * Resolve the plan nodes the site sells from the getPlans edges, by exact Stripe price id.
 *
 * Each plan is matched to the pinned id for the given region. No inference from amount, product, or
 * interval, and no cross-region fallback: if a region's id is not among the active prices returned
 * by getPlans, that plan resolves to undefined (and a warning is logged).
 *
 * @param {Array<{node: object}>} edges - getPlans result data (array of { node }).
 * @param {"br"|"latam"|"intl"} [region="br"] - pricing region for the current domain.
 * @returns {Record<string, object|undefined>} plan key → price node (undefined if the pinned id
 *   isn't among the active prices returned by getPlans).
 */
export function selectPlans(edges = [], region = DEFAULT_REGION) {
  const ids = priceIds(region)
  const plans = {}

  for (const key of PLAN_KEYS) {
    const wantedId = ids[key]
    const match = edges.find(({ node }) => node.stripePriceId === wantedId)

    if (!match) {
      console.warn(
        `Stripe price "${key}" for region "${region}" (${wantedId}) not found among active prices ` +
          "from getPlans — check the id and that the price is active."
      )
    }

    plans[key] = match?.node
  }

  return plans
}
