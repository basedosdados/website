import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function removeSubscriptionImmediately(id, token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
        mutation {
          deleteStripeSubscriptionImmediately (subscriptionId: "${id}"){
            subscription {
              id
            }
            errors
          }
        }
        `
      }
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const result = await removeSubscriptionImmediately(atob(req.query.p), token)

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result?.data?.deleteStripeSubscriptionImmediately?.errors.length > 0) return res.status(500).json({error: result.data.deleteStripeSubscription.errors, success: false })
  if(result === "err") return res.status(500).json({error: "err"})

  if(result?.data?.deleteStripeSubscriptionImmediately === null) return res.status(200).json({success: true})
}
