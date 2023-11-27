import axios from "axios";
import cookies from "js-cookie";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

let token = cookies.get("token") || ""
let userData = cookies.get("user") || null
if(userData !== null) userData = JSON.parse(cookies.get("user"))

export default async function createCustomer() {
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
          createStripeCustomer (
            input: {
              name: "${userData.firstName} ${userData.lastName || ""}"
              email: "${userData.email}"
            }
          ) {
            customer {
              id
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.createStripeCustomer?.customer
    return data
  } catch (error) {
    console.error(error)
  }
}
