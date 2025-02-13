import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function addMemberInSubscription(idAdmin, id, token) {
  let subscriptionId = null

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
            allAccount (id: "${idAdmin}") {
              edges {
                node {
                  internalSubscription (isActive: true) {
                    edges {
                      node {
                        _id
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
    subscriptionId = res.data.data.allAccount.edges[0].node.internalSubscription.edges[0].node._id
  } catch (error) {
    return "err"
  }

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
            createStripeCustomerSubscription(accountId: "${id}", subscriptionId: "${subscriptionId}") {
              ok
              errors
            }
          }
        `
      }
    })
    return res.data?.data?.createStripeCustomerSubscription
  } catch(err) {
    return "err"
  }
}

export default async function handler(req, res) {
  const token = () => {
    if(req.query.q) return atob(req.query.q)
    return req.cookies.token
  }

  const result = await addMemberInSubscription(atob(req.query.r), atob(req.query.p), token())

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  res.status(200).json({success: true})
}
