import axios from "axios";
import cookies from "js-cookie";
import { getUserDataJson } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

let userData = getUserDataJson()

export default async function createCustomer() {
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
