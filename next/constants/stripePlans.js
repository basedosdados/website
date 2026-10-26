// Preços do Stripe são identificados por productSlug + interval + region, não pelo amount.
// O amount muda quando alguém reprecifica no dashboard e quebrava a seleção do plano.
// Nesta adaptação só vendemos a região "br". O metadata `region` precisa existir em cada Price.

export const PlanRegion = "br"

export const PlanKeys = [
  "bd_pro_month",
  "bd_pro_year",
  "bd_chatbot_month",
  "bd_chatbot_year",
]

export const planFilters = {
  bd_pro_month: { productSlug: "bd_pro", interval: "month" },
  bd_pro_year: { productSlug: "bd_pro", interval: "year" },
  bd_chatbot_month: { productSlug: "chatbot", interval: "month" },
  bd_chatbot_year: { productSlug: "chatbot", interval: "year" },
}

/**
 * Encontra o preço ativo de um productSlug + interval na região pedida.
 * Sem match, ou com mais de um, registra um aviso em vez de cair no valor errado.
 *
 * @param {Array<{node: object}>} edges
 * @param {{productSlug: string, interval: string}} filter
 * @param {string} region
 * @param {string} label
 * @returns {object|undefined}
 */
export function findPlan(edges, { productSlug, interval }, region = PlanRegion, label) {
  const wantedSlug = productSlug?.toLowerCase()
  const wantedInterval = interval?.toLowerCase()
  const wantedRegion = (region || PlanRegion).toLowerCase()

  const matches = (edges || []).filter(({ node }) => {
    return (
      node?.productSlug?.toLowerCase() === wantedSlug &&
      node?.interval?.toLowerCase() === wantedInterval &&
      node?.region?.toLowerCase() === wantedRegion &&
      node?.isActive !== false
    )
  })

  if (matches.length === 0) {
    console.warn(
      `Stripe price "${label}" for region "${wantedRegion}" not found among active prices from ` +
        "getPlans — check productSlug, interval and region metadata."
    )
    return undefined
  }

  if (matches.length > 1) {
    console.warn(
      `Stripe price "${label}" for region "${wantedRegion}" matched ${matches.length} active prices. Using the first match.`
    )
  }

  return matches[0].node
}

/**
 * Resolve os planos vendidos no site a partir das edges de getPlans.
 *
 * @param {Array<{node: object}>} edges
 * @param {string} [region="br"]
 * @returns {Record<string, object|undefined>}
 */
export function selectPlans(edges = [], region = PlanRegion) {
  const plans = {}

  for (const key of PlanKeys) {
    plans[key] = findPlan(edges, planFilters[key], region, key)
  }

  return plans
}
