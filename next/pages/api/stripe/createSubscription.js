import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function createSubscription({id, coupon, token}) {
  const query = `
    mutation ($priceId: ID!, $coupon: String) {
      createStripeSubscription (priceId: $priceId, coupon: $coupon) {
        clientSecret
      }
    }
  `

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: query,
        variables: { priceId: id, coupon: coupon || null }
      }
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

function decodeQueryParam(value) {
  if (!value) return ""
  try {
    return atob(value)
  } catch {
    return ""
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const result = await createSubscription({
    id: atob(req.query.p),
    coupon: decodeQueryParam(req.query.c),
    token: token
  })

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  res.status(200).json(result?.data?.createStripeSubscription?.clientSecret)
}
