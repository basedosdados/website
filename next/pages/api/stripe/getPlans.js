import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

const PriceFields = `
  _id
  amount
  productName
  productSlug
  interval
  isActive
`

async function getPlans(fields) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allStripePrice (active: true) {
            edges {
              node {
                ${fields}
              }
            }
          }
        }
        `
      }
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    if (error?.response?.data?.errors) return error.response.data
    return "err"
  }
}

export default async function handler(req, res) {
  let result = await getPlans(`${PriceFields} currency`)
  if (result === "err" || result?.errors) result = await getPlans(PriceFields)

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  const edges = (result?.data?.allStripePrice?.edges ?? []).filter(({ node }) => {
    const name = node.productName?.toLowerCase() || ""
    const slug = node.productSlug?.toLowerCase() || ""
    return !name.includes("empresas") && !slug.includes("empresas")
  })

  res.status(200).json({ data: edges, success: true })
}
