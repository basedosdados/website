import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getAlreadySubscribed(id, token) {
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
                  subscriptionSet {
                    edges {
                      node {
                        canceledAt
                        createdAt
                        planInterval
                      }
                    }
                  }
                  internalSubscription {
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

  try {
    const result = await getAlreadySubscribed(atob(req.query.p), token());

    if (result.errors || result === "err") {
      return res.status(500).json(false);
    }

    const accountNode = result?.data?.allAccount?.edges[0]?.node;
    const subscriptionType = req.query.type;
    const internalSubs = accountNode?.internalSubscription?.edges || [];

    const hadBDProSubscription =
      (accountNode?.subscriptionSet?.edges?.length > 0) ||
      internalSubs.some((edge) => {
        const slug = (edge?.node?.stripeSubscription || "").toLowerCase();
        return slug.includes("bd_pro") || slug.includes("empresas");
      });

    const hadChatbotSubscription = internalSubs.some((edge) =>
      (edge?.node?.stripeSubscription || "").toLowerCase().includes("chatbot")
    );

    let isSubscriber;
    if (subscriptionType === "bd_pro") {
      isSubscriber = hadBDProSubscription;
    } else if (subscriptionType === "chatbot") {
      isSubscriber = hadChatbotSubscription;
    } else {
      isSubscriber = hadBDProSubscription || hadChatbotSubscription;
    }

    res.status(200).json(isSubscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json(false);
  }
}
