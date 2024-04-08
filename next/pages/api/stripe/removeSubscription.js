import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function removeSubscription(id, token) {
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
            errors
            subscription {
              id
            }
          }
        }
        `
      }
    })

    const data = res?.data?.data?.deleteStripeSubscription
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const result = await removeSubscription(atob(req.query.p), token)
  res.status(200).json(result)
}
