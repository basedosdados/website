import { request } from "graphql-request"
import { verifySessionToken, requireChatbotAuth } from "../../lib/requireChatbotAuth"

vi.mock("graphql-request", () => ({
  request: vi.fn(),
  gql: (strings) => strings.join(""),
}))

beforeEach(() => {
  request.mockReset()
  vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

const invalid = { valid: false, has_chatbot_access: false, payload: null }

describe("verifySessionToken", () => {
  it("rejeita sem token e não chama a API", async () => {
    expect(await verifySessionToken("")).toEqual(invalid)
    expect(request).not.toHaveBeenCalled()
  })

  it("aceita payload em string JSON", async () => {
    request.mockResolvedValue({ verifyToken: { payload: '{"has_chatbot_access": true, "id": 1}' } })
    expect(await verifySessionToken("t")).toEqual({
      valid: true,
      has_chatbot_access: true,
      payload: { has_chatbot_access: true, id: 1 },
    })
    expect(request).toHaveBeenCalledWith(expect.any(String), expect.anything(), { token: "t" })
  })

  it("aceita payload em objeto", async () => {
    request.mockResolvedValue({ verifyToken: { payload: { has_chatbot_access: false } } })
    expect(await verifySessionToken("t")).toMatchObject({ valid: true, has_chatbot_access: false })
  })

  it("só libera com has_chatbot_access === true", async () => {
    request.mockResolvedValue({ verifyToken: { payload: { has_chatbot_access: "true" } } })
    expect((await verifySessionToken("t")).has_chatbot_access).toBe(false)
  })

  it("trata payload JSON inválido como vazio", async () => {
    request.mockResolvedValue({ verifyToken: { payload: "{oops" } })
    expect(await verifySessionToken("t")).toEqual({ valid: true, has_chatbot_access: false, payload: {} })
  })

  it("é inválido sem verifyToken na resposta", async () => {
    request.mockResolvedValue({ verifyToken: null })
    expect(await verifySessionToken("t")).toEqual(invalid)
  })

  it("é inválido quando a API falha", async () => {
    request.mockRejectedValue(new Error("expired"))
    expect(await verifySessionToken("t")).toEqual(invalid)
  })
})

describe("requireChatbotAuth", () => {
  it("401 sem token", async () => {
    expect(await requireChatbotAuth({ headers: {} })).toEqual({
      ok: false,
      status: 401,
      error: "Missing authentication token",
    })
  })

  it("401 com token inválido", async () => {
    request.mockRejectedValue(new Error("invalid"))
    expect(await requireChatbotAuth({ cookies: { token: "t" } })).toMatchObject({ ok: false, status: 401 })
  })

  it("403 sem acesso ao chatbot", async () => {
    request.mockResolvedValue({ verifyToken: { payload: { has_chatbot_access: false } } })
    expect(await requireChatbotAuth({ cookies: { token: "t" } })).toEqual({
      ok: false,
      status: 403,
      error: "Chatbot access required",
    })
  })

  it("libera com acesso e devolve o header", async () => {
    request.mockResolvedValue({ verifyToken: { payload: { has_chatbot_access: true } } })
    expect(await requireChatbotAuth({ headers: { authorization: "Bearer t" } })).toEqual({
      ok: true,
      authHeader: "Bearer t",
      payload: { has_chatbot_access: true },
    })
  })
})
