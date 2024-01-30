import axios from "axios";
import cookies from "js-cookie";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function createSubscription( priceId ) {
  let token = cookies.get("token") || ""

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
          createStripeSubscription (priceId: ${priceId}) {
            subscription {
              id
              clientSecret
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.createStripeSubscription?.subscription
    return data
  } catch (error) {
    console.error(error)
  }
}
