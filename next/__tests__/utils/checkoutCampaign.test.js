import cookies from "js-cookie"
import {
  parseCheckoutCampaignQuery,
  buildCheckoutCampaignQuery,
  getLoginRedirectWithCheckout,
  getPlansAndPaymentRoute,
  persistCheckoutCampaignFromQuery,
  getCheckoutCampaign,
  resolveCheckoutCampaign,
  clearCheckoutCampaign,
  consumeCheckoutCampaignRedirect,
} from "../../utils"

function setSearch(search) {
  window.history.replaceState({}, "", `/${search}`)
}

function clearAllCookies() {
  Object.keys(cookies.get()).forEach((name) => cookies.remove(name, { path: "/" }))
}

beforeEach(() => {
  setSearch("")
  clearAllCookies()
})

describe("parseCheckoutCampaignQuery", () => {
  it("normaliza produto, cupom e intervalo", () => {
    expect(
      parseCheckoutCampaignQuery({ checkout: "BDPRO", coupon: "  PROMO10 ", interval: "MONTH" }),
    ).toEqual({ product: "bd_pro", coupon: "PROMO10", interval: "month" })
  })

  it("descarta valores inválidos", () => {
    expect(parseCheckoutCampaignQuery({ checkout: "outro", interval: "week" })).toEqual({
      product: "",
      coupon: "",
      interval: "",
    })
  })

  it("usa o primeiro valor de arrays", () => {
    expect(parseCheckoutCampaignQuery({ checkout: ["chatbot", "bd_pro"] }).product).toBe("chatbot")
  })

  it("lê a URL atual e deixa a query do router sobrescrever", () => {
    setSearch("?checkout=chatbot&coupon=URL&interval=year")
    expect(parseCheckoutCampaignQuery({ coupon: "ROUTER" })).toEqual({
      product: "chatbot",
      coupon: "ROUTER",
      interval: "year",
    })
  })

  it("aceita query nula", () => {
    expect(parseCheckoutCampaignQuery(null)).toEqual({ product: "", coupon: "", interval: "" })
  })
})

describe("buildCheckoutCampaignQuery", () => {
  it("omite campos vazios", () => {
    expect(buildCheckoutCampaignQuery({ product: "chatbot", coupon: "", interval: "month" })).toEqual({
      checkout: "chatbot",
      interval: "month",
    })
    expect(buildCheckoutCampaignQuery(null)).toEqual({})
  })
})

describe("getLoginRedirectWithCheckout", () => {
  it("monta a URL de login com a campanha", () => {
    expect(getLoginRedirectWithCheckout({ checkout: "chatbot", coupon: "X", interval: "year" })).toBe(
      "/user/login?checkout=chatbot&coupon=X&interval=year",
    )
  })

  it("retorna o login puro sem campanha", () => {
    expect(getLoginRedirectWithCheckout()).toBe("/user/login")
  })
})

describe("getPlansAndPaymentRoute", () => {
  it("aponta para a aba de planos com a campanha", () => {
    expect(getPlansAndPaymentRoute({ product: "bd_pro", coupon: "C" })).toEqual({
      pathname: "/user",
      query: { plans_and_payment: "", checkout: "bd_pro", coupon: "C" },
    })
  })
})

describe("persistência em cookie", () => {
  it("salva, lê e limpa a campanha", () => {
    persistCheckoutCampaignFromQuery({ checkout: "chatbot", coupon: "C1", interval: "month" })
    expect(getCheckoutCampaign()).toEqual({ product: "chatbot", coupon: "C1", interval: "month" })

    clearCheckoutCampaign()
    expect(getCheckoutCampaign()).toEqual({ product: "", coupon: "", interval: "" })
  })

  it("não grava nada sem produto nem cupom", () => {
    persistCheckoutCampaignFromQuery({ interval: "month" })
    expect(getCheckoutCampaign().interval).toBe("")
  })

  it("resolveCheckoutCampaign prioriza a query sobre o cookie", () => {
    persistCheckoutCampaignFromQuery({ checkout: "chatbot", coupon: "COOKIE", interval: "year" })
    expect(resolveCheckoutCampaign({ coupon: "QUERY" })).toEqual({
      product: "chatbot",
      coupon: "QUERY",
      interval: "year",
    })
  })
})

describe("consumeCheckoutCampaignRedirect", () => {
  const makeRouter = (overrides = {}) => ({
    isReady: true,
    pathname: "/prices",
    query: { checkout: "chatbot", coupon: "C" },
    replace: vi.fn(),
    ...overrides,
  })

  it("não faz nada antes do router estar pronto", () => {
    const router = makeRouter({ isReady: false })
    consumeCheckoutCampaignRedirect(router)
    expect(router.replace).not.toHaveBeenCalled()
  })

  it("não redireciona sem produto", () => {
    const router = makeRouter({ query: { coupon: "C" } })
    consumeCheckoutCampaignRedirect(router)
    expect(router.replace).not.toHaveBeenCalled()
  })

  it("não redireciona em páginas de passagem", () => {
    const router = makeRouter({ pathname: "/user/login" })
    consumeCheckoutCampaignRedirect(router)
    expect(router.replace).not.toHaveBeenCalled()
  })

  it("manda o visitante deslogado para o login", () => {
    const router = makeRouter()
    consumeCheckoutCampaignRedirect(router)
    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/user/login",
      query: { checkout: "chatbot", coupon: "C" },
    })
  })

  it("manda o usuário logado para planos e pagamento", () => {
    cookies.set("userBD", JSON.stringify({ id: "1" }), { path: "/" })
    const router = makeRouter()
    consumeCheckoutCampaignRedirect(router)
    expect(router.replace).toHaveBeenCalledWith({
      pathname: "/user",
      query: { plans_and_payment: "", checkout: "chatbot", coupon: "C" },
    })
  })
})
