import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getPrices() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allStripePrice {
            edges {
              node {
                _id
                amount
                productName
                productSlug
                productSlots
              }
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.allStripePrice?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}
