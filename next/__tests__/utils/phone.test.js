import {
  sanitizePhoneInput,
  formatPhoneInput,
  handlePhoneInputChange,
  normalizePhone,
  isValidE164Phone,
  splitStoredPhone,
  formatPhoneDisplay,
  getDefaultCallingCode,
  getPhoneCountry,
} from "../../utils"

describe("sanitizePhoneInput", () => {
  it("mantém só dígitos", () => {
    expect(sanitizePhoneInput("+55 (11) 9 9999-9999")).toBe("5511999999999")
  })

  it("trata valores vazios", () => {
    expect(sanitizePhoneInput(null)).toBe("")
    expect(sanitizePhoneInput(undefined)).toBe("")
    expect(sanitizePhoneInput("")).toBe("")
  })
})

describe("getDefaultCallingCode / getPhoneCountry", () => {
  it("usa o código do idioma e cai no Brasil", () => {
    expect(getDefaultCallingCode("pt")).toBe("55")
    expect(getDefaultCallingCode("en")).toBe("1")
    expect(getDefaultCallingCode("es")).toBe("52")
    expect(getDefaultCallingCode("fr")).toBe("55")
  })

  it("cai no Brasil para código desconhecido", () => {
    expect(getPhoneCountry("999").iso).toBe("BR")
    expect(getPhoneCountry("44").iso).toBe("GB")
  })
})

describe("formatPhoneInput", () => {
  it.each([
    ["1", "(1"],
    ["11", "(11)"],
    ["119", "(11) 9"],
    ["11999", "(11) 9 99"],
    ["11999999999", "(11) 9 9999-9999"],
    ["119999999999999", "(11) 9 9999-9999"],
  ])("formata Brasil progressivamente: %s → %s", (input, expected) => {
    expect(formatPhoneInput(input, "55")).toBe(expected)
  })

  it("remove o código do país quando colado junto ao número", () => {
    expect(formatPhoneInput("+55 11 99999-9999", "55")).toBe("(11) 9 9999-9999")
  })

  it.each([
    ["555", "(555)"],
    ["5551", "(555) 1"],
    ["5551234567", "(555) 123-4567"],
  ])("formata EUA: %s → %s", (input, expected) => {
    expect(formatPhoneInput(input, "1")).toBe(expected)
  })

  it.each([
    ["52", "5512345678", "55 1234 5678"],
    ["54", "1112345678", "11 1234-5678"],
    ["57", "3001234567", "300 123 4567"],
    ["56", "912345678", "9 1234 5678"],
    ["51", "912345678", "912 345 678"],
    ["351", "912345678", "912 345 678"],
    ["34", "612345678", "612 34 56 78"],
    ["44", "7400123456", "7400 123456"],
  ])("formata o país %s", (code, input, expected) => {
    expect(formatPhoneInput(input, code)).toBe(expected)
  })

  it("retorna vazio sem dígitos", () => {
    expect(formatPhoneInput("", "55")).toBe("")
    expect(formatPhoneInput("abc", "1")).toBe("")
  })
})

describe("handlePhoneInputChange", () => {
  it("apaga um dígito quando o backspace remove só a máscara", () => {
    expect(handlePhoneInputChange("(11)", "(11", "55")).toBe("(1")
  })

  it("formata normalmente ao digitar", () => {
    expect(handlePhoneInputChange("(11)", "(11)9", "55")).toBe("(11) 9")
  })
})

describe("normalizePhone", () => {
  it("gera E.164", () => {
    expect(normalizePhone("(11) 9 9999-9999", "55")).toBe("+5511999999999")
    expect(normalizePhone("(555) 123-4567", "1")).toBe("+15551234567")
  })

  it("usa Brasil como padrão", () => {
    expect(normalizePhone("11999999999")).toBe("+5511999999999")
  })

  it("retorna vazio sem dígitos", () => {
    expect(normalizePhone("", "55")).toBe("")
  })
})

describe("isValidE164Phone", () => {
  it.each(["+5511999999999", "+15551234567", "+44740012345"])("aceita %s", (value) => {
    expect(isValidE164Phone(value)).toBe(true)
  })

  it.each(["5511999999999", "+0551199999", "+1234567", "+1234567890123456", "", undefined])(
    "rejeita %s",
    (value) => {
      expect(isValidE164Phone(value)).toBe(false)
    },
  )
})

describe("splitStoredPhone", () => {
  it("separa código e número local", () => {
    expect(splitStoredPhone("+5511999999999", "pt")).toEqual({
      callingCode: "55",
      localNumber: "11999999999",
    })
    expect(splitStoredPhone("+15551234567", "pt")).toEqual({
      callingCode: "1",
      localNumber: "5551234567",
    })
  })

  it("prefere o código mais longo (351 antes de 35/3)", () => {
    expect(splitStoredPhone("+351912345678", "pt")).toEqual({
      callingCode: "351",
      localNumber: "912345678",
    })
  })

  it("usa o código do idioma quando vazio", () => {
    expect(splitStoredPhone("", "en")).toEqual({ callingCode: "1", localNumber: "" })
  })

  it("devolve os dígitos com o código padrão quando nenhum país casa", () => {
    expect(splitStoredPhone("999", "pt")).toEqual({ callingCode: "55", localNumber: "999" })
  })
})

describe("formatPhoneDisplay", () => {
  it("formata para exibição", () => {
    expect(formatPhoneDisplay("+5511999999999", "pt")).toBe("+55 (11) 9 9999-9999")
    expect(formatPhoneDisplay("+15551234567", "en")).toBe("+1 (555) 123-4567")
  })

  it("retorna vazio sem valor", () => {
    expect(formatPhoneDisplay("", "pt")).toBe("")
    expect(formatPhoneDisplay(null, "pt")).toBe("")
  })
})
