import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

function matchesSubscriptionType(stripeSubscription, type) {
  const normalized = (stripeSubscription || "").toLowerCase()
  if (!type) return true
  if (type === "chatbot") return normalized.includes("chatbot")
  if (type === "bd_pro") return normalized.includes("bd_pro") || normalized.includes("empresas")
  return true
}

async function getSubscriptionActive(id, token, type) {
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
    const target = subscriptions.find((subscription) => matchesSubscriptionType(subscription?.stripeSubscription, type))
    return target?._id || null
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const subscriptionType = req.query.t ? atob(req.query.t) : null
  const result = await getSubscriptionActive(atob(req.query.p), token, subscriptionType)

  if(result === "err") return res.status(500).json({error: "err"})
  if(!result) return res.status(404).json({error: "subscription_not_found"})

  res.status(200).json(result)
}