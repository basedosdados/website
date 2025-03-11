import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getSubscriptionActive(id, token) {
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
                  internalSubscription (isActive: true, first: 1){
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
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const result = await getSubscriptionActive(atob(req.query.p), token)

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  res.status(200).json(result?.data?.allAccount?.edges[0]?.node?.internalSubscription?.edges[0]?.node?._id)
}