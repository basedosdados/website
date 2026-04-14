import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

function matchesSubscriptionType(stripeSubscription, type) {
  const normalized = (stripeSubscription || "").toLowerCase()
  if (!type) return true
  if (type === "chatbot") return normalized.includes("chatbot")
  if (type === "bd_pro") return normalized.includes("bd_pro") || normalized.includes("empresas")
  return true
}

async function removeSubscriptionById(id, token) {
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
          deleteStripeSubscription (subscriptionId: "${id}"){
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
    return data?.data?.deleteStripeSubscription
  } catch (error) {
    console.error(error)
    return "err"
  }
}

async function getSubscriptionIdByAccount(id, token, subscriptionType) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
          query {
            allAccount (id: "${id}"){
              edges {
                node {
                  internalSubscription (isActive: true, first: 20){
                    edges {
                      node {
                        _id
                        stripeSubscription
                      }
                    }
                  }
                }
              }
            }
          }
        `
      }
    })

    const subscriptions = res?.data?.data?.allAccount?.edges?.[0]?.node?.internalSubscription?.edges?.map((edge) => edge?.node) || []
    const targetSubscription = subscriptions.find((sub) => matchesSubscriptionType(sub?.stripeSubscription, subscriptionType))
    return targetSubscription?._id || null
  } catch (error) {
    console.error(error)
    return null
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const hasTypeParam = Boolean(req.query.t)
  const subscriptionType = hasTypeParam ? atob(req.query.t) : null
  const payload = atob(req.query.p)

  const subscriptionId = hasTypeParam
    ? await getSubscriptionIdByAccount(payload, token, subscriptionType)
    : payload

  if (!subscriptionId) return res.status(404).json({error: "subscription_not_found", success: false})

  const result = await removeSubscriptionById(subscriptionId, token)

  if(result === "err") return res.status(500).json({error: "err"})

  if(result === null) return res.status(200).json({success: true})
  if(result?.errors?.length > 0) return res.status(500).json({error: result.errors, success: false })

  return res.status(200).json({success: true})
}
