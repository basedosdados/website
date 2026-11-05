import { getDomain, isBasedosdadosDomain, getDiscordUrl, isUtmQueryParam, hasNonUtmQueryParams } from "../../utils"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("getDomain", () => {
  it("usa NEXT_PUBLIC_DOMAIN sem www", () => {
    vi.stubEnv("NEXT_PUBLIC_DOMAIN", "www.data-basis.org")
    expect(getDomain()).toBe("data-basis.org")
  })

  it("cai no hostname do navegador", () => {
    vi.stubEnv("NEXT_PUBLIC_DOMAIN", "")
    expect(getDomain()).toBe(window.location.hostname.replace(/^www\./, ""))
  })
})

describe("isBasedosdadosDomain", () => {
  it.each([
    ["basedosdados.org", true],
    ["www.basedosdados.org", true],
    ["data-basis.org", false],
    ["basedelosdatos.org", false],
  ])("%s → %s", (domain, expected) => {
    vi.stubEnv("NEXT_PUBLIC_DOMAIN", domain)
    expect(isBasedosdadosDomain()).toBe(expected)
  })
})

describe("getDiscordUrl", () => {
  it("retorna um convite por idioma e cai no português", () => {
    const pt = getDiscordUrl("pt")
    expect(getDiscordUrl("en")).not.toBe(pt)
    expect(getDiscordUrl("es")).not.toBe(pt)
    expect(getDiscordUrl("fr")).toBe(pt)
    expect(getDiscordUrl()).toBe(pt)
  })
})

describe("UTM", () => {
  it("isUtmQueryParam", () => {
    expect(isUtmQueryParam("utm_source")).toBe(true)
    expect(isUtmQueryParam("utm_id")).toBe(false)
    expect(isUtmQueryParam("q")).toBe(false)
  })

  it("hasNonUtmQueryParams", () => {
    expect(hasNonUtmQueryParams("?utm_source=a&utm_medium=b")).toBe(false)
    expect(hasNonUtmQueryParams("")).toBe(false)
    expect(hasNonUtmQueryParams("?utm_source=a&page=2")).toBe(true)
  })
})
