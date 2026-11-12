import axios from "axios";
import { getSubscriptionIdByAccount } from "./removeSubscription";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function reactivateSubscription({ subscriptionId, priceId, coupon, token }) {
  const query = `
    mutation ($subscriptionId: ID!, $priceId: ID, $coupon: String) {
      reactivateStripeSubscription (subscriptionId: $subscriptionId, priceId: $priceId, coupon: $coupon) {
        ok
        clientSecret
        errors
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
        variables: {
          subscriptionId,
          priceId: priceId || null,
          coupon: coupon || null,
        }
      }
    })
    return res.data
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
  const userId = decodeQueryParam(req.query.p)
  const type = decodeQueryParam(req.query.t)

  const subscriptionId = await getSubscriptionIdByAccount(userId, token, type)
  if (!subscriptionId) return res.status(404).json({ error: "subscription_not_found" })

  const result = await reactivateSubscription({
    subscriptionId,
    priceId: decodeQueryParam(req.query.pr),
    coupon: decodeQueryParam(req.query.c),
    token,
  })

  if (result === "err" || result?.errors) return res.status(500).json({ error: "err" })

  const data = result?.data?.reactivateStripeSubscription
  if (data?.errors?.length > 0) return res.status(400).json({ error: data.errors[0] })
  if (data?.clientSecret) return res.status(200).json({ clientSecret: data.clientSecret })
  if (data?.ok) return res.status(200).json({ ok: true })

  return res.status(500).json({ error: "err" })
}
