import {
  getTokenFromRequest,
  getAuthorizationHeader,
  serializeTokenCookie,
  serializeClearedTokenCookie,
} from "../../lib/authCookie"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("getTokenFromRequest", () => {
  it("prioriza o header Authorization", () => {
    const req = {
      headers: { authorization: "Bearer header-token" },
      cookies: { token: "cookie-token" },
      body: { token: "body-token" },
    }
    expect(getTokenFromRequest(req)).toBe("header-token")
  })

  it("usa o cookie quando não há header Bearer", () => {
    const req = {
      headers: { authorization: "Basic abc" },
      cookies: { token: " cookie-token " },
      body: { token: "body-token" },
    }
    expect(getTokenFromRequest(req)).toBe("cookie-token")
  })

  it("ignora Bearer vazio e cai no cookie", () => {
    const req = { headers: { authorization: "Bearer   " }, cookies: { token: "cookie-token" } }
    expect(getTokenFromRequest(req)).toBe("cookie-token")
  })

  it("usa o body por último", () => {
    const req = { headers: {}, cookies: { token: "  " }, body: { token: "body-token" } }
    expect(getTokenFromRequest(req)).toBe("body-token")
  })

  it("retorna null sem token", () => {
    expect(getTokenFromRequest({})).toBeNull()
    expect(getTokenFromRequest({ headers: {}, cookies: {}, body: {} })).toBeNull()
  })
})

describe("getAuthorizationHeader", () => {
  it("monta o header Bearer", () => {
    expect(getAuthorizationHeader({ cookies: { token: "abc" } })).toBe("Bearer abc")
  })

  it("retorna null sem token", () => {
    expect(getAuthorizationHeader({})).toBeNull()
  })
})

describe("serializeTokenCookie", () => {
  it("define flags seguras e validade de 7 dias", () => {
    vi.stubEnv("NODE_ENV", "development")
    const cookie = serializeTokenCookie("abc")
    expect(cookie).toMatch(/^token=abc;/)
    expect(cookie).toContain("Max-Age=604800")
    expect(cookie).toContain("Path=/")
    expect(cookie).toContain("HttpOnly")
    expect(cookie).toContain("SameSite=Lax")
    expect(cookie).not.toContain("Secure")
  })

  it("marca Secure em produção", () => {
    vi.stubEnv("NODE_ENV", "production")
    expect(serializeTokenCookie("abc")).toContain("Secure")
  })

  it("aceita maxAge customizado", () => {
    expect(serializeTokenCookie("abc", { maxAge: 60 })).toContain("Max-Age=60")
  })
})

describe("serializeClearedTokenCookie", () => {
  it("gera um cookie vazio já expirado", () => {
    const cookie = serializeClearedTokenCookie()
    expect(cookie).toMatch(/^token=;/)
    expect(cookie).toContain("Max-Age=-1")
    expect(cookie).toContain("HttpOnly")
    expect(cookie).toContain("Path=/")
  })
})
