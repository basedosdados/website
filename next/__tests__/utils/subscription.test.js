import {
  hasBDProSubscription,
  getActiveInternalSubscription,
  hasChatbotSubscription,
  isSubscriptionTrialing,
  getSubscriptionStatusKey,
  getSubscriptionType,
  isUserLoggedIn,
  getUserDisplayName,
  getUserPageHref,
} from "../../utils"

const withSubscriptions = (...nodes) => ({
  internalSubscription: { edges: nodes.map((node) => ({ node })) },
})

describe("hasBDProSubscription", () => {
  it.each(["bd_pro", "bd_pro_empresas"])("reconhece %s", (proSubscription) => {
    expect(hasBDProSubscription({ proSubscription })).toBe(true)
  })

  it("rejeita outros valores e usuário ausente", () => {
    expect(hasBDProSubscription({ proSubscription: "chatbot" })).toBe(false)
    expect(hasBDProSubscription(null)).toBe(false)
  })
})

describe("getActiveInternalSubscription", () => {
  it("prioriza a assinatura BD Pro", () => {
    const chatbot = { stripeSubscription: "chatbot" }
    const pro = { stripeSubscription: "BD_PRO" }
    expect(getActiveInternalSubscription(withSubscriptions(chatbot, pro))).toBe(pro)
  })

  it("reconhece BD Pro Empresas", () => {
    const empresas = { stripeSubscription: "empresas" }
    expect(getActiveInternalSubscription(withSubscriptions({ stripeSubscription: "x" }, empresas))).toBe(empresas)
  })

  it("cai na primeira assinatura ou null", () => {
    const first = { stripeSubscription: "chatbot" }
    expect(getActiveInternalSubscription(withSubscriptions(first))).toBe(first)
    expect(getActiveInternalSubscription({})).toBeNull()
  })
})

describe("hasChatbotSubscription", () => {
  it("detecta chatbot sem diferenciar maiúsculas", () => {
    expect(hasChatbotSubscription(withSubscriptions({ stripeSubscription: "BD_Chatbot" }))).toBe(true)
  })

  it("retorna false sem assinatura de chatbot", () => {
    expect(hasChatbotSubscription(withSubscriptions({ stripeSubscription: "bd_pro" }))).toBe(false)
    expect(hasChatbotSubscription(undefined)).toBe(false)
  })
})

describe("status da assinatura", () => {
  it("isSubscriptionTrialing", () => {
    expect(isSubscriptionTrialing({ stripeSubscriptionStatus: "TRIALING" })).toBe(true)
    expect(isSubscriptionTrialing({ stripeSubscriptionStatus: "active" })).toBe(false)
    expect(isSubscriptionTrialing(null)).toBe(false)
  })

  it("getSubscriptionStatusKey", () => {
    expect(getSubscriptionStatusKey({ stripeSubscriptionStatus: "trialing", canceledAt: "x" })).toBe("trial")
    expect(getSubscriptionStatusKey({ canceledAt: "2026-01-01" })).toBe("canceled")
    expect(getSubscriptionStatusKey({})).toBe("active")
  })
})

describe("getSubscriptionType", () => {
  it("prioriza bd_pro, depois chatbot", () => {
    expect(
      getSubscriptionType({
        proSubscription: "bd_pro",
        ...withSubscriptions({ stripeSubscription: "chatbot" }),
      }),
    ).toBe("bd_pro")
    expect(getSubscriptionType(withSubscriptions({ stripeSubscription: "chatbot" }))).toBe("chatbot")
  })

  it("distingue assinante desconhecido de não assinante", () => {
    expect(getSubscriptionType({ isSubscriber: true })).toBe("unknown")
    expect(getSubscriptionType({})).toBe("none")
  })
})

describe("usuário", () => {
  it("isUserLoggedIn", () => {
    expect(isUserLoggedIn({ id: "1" })).toBe(true)
    expect(isUserLoggedIn({ email: "a@b.c" })).toBe(true)
    expect(isUserLoggedIn({})).toBe(false)
    expect(isUserLoggedIn(null)).toBe(false)
  })

  it("getUserDisplayName", () => {
    expect(getUserDisplayName({ firstName: "Ana", lastName: "Silva" })).toBe("Ana Silva")
    expect(getUserDisplayName({ firstName: "Ana" })).toBe("Ana")
    expect(getUserDisplayName(null)).toBe("")
  })

  it("getUserPageHref", () => {
    expect(getUserPageHref()).toBe("/user")
    expect(getUserPageHref("account")).toBe("/user?account")
  })
})
