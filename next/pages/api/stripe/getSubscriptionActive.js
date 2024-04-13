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
            allAccount (id : "${id}"){
              edges {
                node {
                  internalSubscription (isActive: true){
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
    const data = res.data?.data?.allAccount?.edges[0]?.node?.internalSubscription?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const result = await getSubscriptionActive(atob(req.query.p), token)
  res.status(200).json(result)
}