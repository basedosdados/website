import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getUser(id, token) {
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
                  id
                  isAdmin
                  isActive
                  isEmailVisible
                  gcpEmail
                  picture
                  username
                  firstName
                  lastName
                  email
                  website
                  github
                  twitter
                  linkedin
                  workDataTool
                  availableForResearch
                  isSubscriber
                  proSubscription
                  proSubscriptionRole
                  proSubscriptionSlots
                  subscriptionSet (isActive: true) {
                    edges {
                      node {
                        canceledAt
                        createdAt
                        planInterval
                      }
                    }
                  }
                  internalSubscription (isActive: true, first: 20) {
                    edges {
                      node {
                        canceledAt
                        createdAt
                        isActive
                        stripeSubscription
                        planInterval
                        nextBillingCycle
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
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = () => {
    if(req.query.q) return atob(req.query.q)
    return req.cookies.token
  }

  const result = await getUser(atob(req.query.p), token())

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  const accountNode = result?.data?.allAccount?.edges?.[0]?.node
  const internalSubscriptions = accountNode?.internalSubscription?.edges || []
  const sortedSubscriptions = [...internalSubscriptions].sort((a, b) => {
    const aSlug = (a?.node?.stripeSubscription || "").toLowerCase()
    const bSlug = (b?.node?.stripeSubscription || "").toLowerCase()
    const aIsBDPro = aSlug.includes("bd_pro") || aSlug.includes("empresas")
    const bIsBDPro = bSlug.includes("bd_pro") || bSlug.includes("empresas")

    if (aIsBDPro && !bIsBDPro) return -1
    if (!aIsBDPro && bIsBDPro) return 1
    return 0
  })

  res.status(200).json({
    ...accountNode,
    internalSubscription: {
      ...accountNode?.internalSubscription,
      edges: sortedSubscriptions
    }
  })
}
