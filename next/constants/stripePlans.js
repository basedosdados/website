// The exact Stripe prices the site sells, selected by their stable Stripe price id ("price_…",
// verifiable in the Stripe dashboard). Selecting by id is robust to other active prices existing
// on the same product — legacy tiers, gift prices, and the per-currency prices being added for
// the international rollout.
//
// These are the current consumer (BRL) prices. The international/USD prices are selected by the
// upcoming currency logic, not here.
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

const DEFAULT_PRICE_IDS = {
  bd_pro_month: "price_1OcrtHCKkCLMrYWYcxJtHMMa", // BD Pro — R$47/month
  bd_pro_year: "price_1PWlKQCKkCLMrYWYxV3xodMC", // BD Pro — R$444/year
  bd_chatbot_month: "price_1TCkdbCKkCLMrYWYFgOfi2cc", // Chatbot — R$30/month
  bd_chatbot_year: "price_1TCkdwCKkCLMrYWYXQlflpIn", // Chatbot — R$326/year
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
 * Resolve the plan nodes the site sells from the getPlans edges, by exact Stripe price id.
 *
 * @param {Array<{node: object}>} edges - getPlans result data (array of { node }).
 * @returns {Record<string, object|undefined>} plan-key -> price node (undefined if the
 *   configured id isn't among the active prices returned by getPlans).
 */
export function selectPlans(edges = []) {
  const ids = priceIds()
  const plans = {}

  for (const key of PLAN_KEYS) {
    const wantedId = ids[key]
    const match = edges.find(({ node }) => node.stripePriceId === wantedId)

    if (!match) {
      console.warn(
        `Stripe price "${key}" (${wantedId}) not found among active prices from getPlans — ` +
          "check the id and that the price is active."
      )
    }

    plans[key] = match?.node
  }

  return plans
}
