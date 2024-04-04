import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function createCustomer(token, userBD) {
  function trimName() {
    const name = userBD.firstName + userBD?.lastName || ""
    return name.replace(/\s+/g, ' ').trim()
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
          createStripeCustomer (
            input: {
              name: "${trimName()}"
              email: "${userBD.email}"
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

export default async function handler(req, res) {
  const token = req.cookies.token
  const userBD = req.cookies.userBD

  const result = await createCustomer(token, userBD)
  res.status(200).json(result)
}
