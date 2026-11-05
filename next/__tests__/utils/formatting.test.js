import {
  formatBytes,
  formatMetaDescription,
  cleanGraphQLResponse,
  removeEmpty,
  cleanString,
  localizeQueryTableAlias,
} from "../../utils"

describe("formatBytes", () => {
  it.each([
    [0, "0 B"],
    [1023, "1023 B"],
    [1024, "1.00 KB"],
    [1536, "1.50 KB"],
    [1024 ** 2, "1.00 MB"],
    [1024 ** 3, "1.00 GB"],
    [1024 ** 4, "1.00 TB"],
  ])("%i → %s", (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected)
  })
})

describe("cleanString", () => {
  it("apara e colapsa espaços", () => {
    expect(cleanString("  a   b\n\tc  ")).toBe("a b c")
  })
})

describe("formatMetaDescription", () => {
  it("retorna vazio sem texto", () => {
    expect(formatMetaDescription("")).toBe("")
    expect(formatMetaDescription(null)).toBe("")
  })

  it("remove a marcação markdown", () => {
    const md = "# Título\n\n**Negrito** e _itálico_ com [link](https://x.org) e `código`.\n- item\n> citação"
    expect(formatMetaDescription(md)).toBe("Título Negrito e itálico com link e código. item citação")
  })

  it("remove blocos de código e imagens", () => {
    expect(formatMetaDescription("Antes ```sql\nSELECT 1\n``` ![alt](img.png) depois")).toBe("Antes depois")
  })

  it("trunca numa fronteira de palavra com reticências", () => {
    const text = "palavra ".repeat(50)
    const result = formatMetaDescription(text, 50)
    expect(result.length).toBeLessThanOrEqual(50)
    expect(result.endsWith("…")).toBe(true)
    expect(result).not.toMatch(/\s…$/)
    expect(result.slice(0, -1).split(" ").every((w) => w === "palavra")).toBe(true)
  })

  it("remove pontuação solta antes das reticências", () => {
    const text = `${"a".repeat(30)} ${"b".repeat(10)}, ${"c".repeat(30)}`
    expect(formatMetaDescription(text, 50)).toBe(`${"a".repeat(30)} ${"b".repeat(10)}…`)
  })
})

describe("removeEmpty", () => {
  it("remove null/undefined recursivamente e mantém falsy válidos", () => {
    expect(removeEmpty({ a: null, b: undefined, c: 0, d: "", e: false, f: { g: null, h: 1 } })).toEqual({
      c: 0,
      d: "",
      e: false,
      f: { h: 1 },
    })
  })
})

describe("cleanGraphQLResponse", () => {
  it("remove __typename e nulos", () => {
    expect(
      cleanGraphQLResponse({ __typename: "Key", id: "1", name: null, owner: { __typename: "User", email: "a@b.c" } }),
    ).toEqual({ id: "1", owner: { email: "a@b.c" } })
  })

  it("achata edges/node num objeto indexado", () => {
    const input = {
      __typename: "Query",
      dataset: {
        __typename: "Dataset",
        name: "rais",
        description: null,
        tables: {
          edges: [{ node: { __typename: "Table", slug: "vinculos" } }, { node: { slug: "estab" } }],
        },
      },
    }
    const result = cleanGraphQLResponse(input)
    expect(result).toEqual({
      dataset: { name: "rais", tables: { 0: { slug: "vinculos" }, 1: { slug: "estab" } } },
    })
    expect(result.dataset.tables[0].slug).toBe("vinculos")
    expect(Object.values(result.dataset.tables)).toHaveLength(2)
  })

  it("devolve primitivos e null como estão", () => {
    expect(cleanGraphQLResponse(null)).toBeNull()
    expect(cleanGraphQLResponse("x")).toBe("x")
    expect(cleanGraphQLResponse(3)).toBe(3)
  })
})

describe("localizeQueryTableAlias", () => {
  const query = "SELECT dados.ano FROM `basedosdados.br_me_rais.vinculos` AS dados WHERE dados.ano > 2020"

  it("mantém o alias em português", () => {
    expect(localizeQueryTableAlias(query, "pt")).toBe(query)
    expect(localizeQueryTableAlias(query, "fr")).toBe(query)
  })

  it("troca o alias sem mexer em basedosdados.<dataset>", () => {
    expect(localizeQueryTableAlias(query, "en")).toBe(
      "SELECT data.ano FROM `basedosdados.br_me_rais.vinculos` AS data WHERE data.ano > 2020",
    )
    expect(localizeQueryTableAlias(query, "es")).toBe(
      "SELECT datos.ano FROM `basedosdados.br_me_rais.vinculos` AS datos WHERE datos.ano > 2020",
    )
  })

  it("ignora valores que não são string", () => {
    expect(localizeQueryTableAlias(undefined, "en")).toBeUndefined()
  })
})
