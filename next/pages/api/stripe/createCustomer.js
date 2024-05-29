import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function createCustomer(token, userBD) {
  const user = JSON.parse(userBD)

  function trimName() {
    const name = user.firstName + user?.lastName || ""
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
              email: "${user.email}"
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
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const userBD = req.cookies.userBD
  const result = await createCustomer(token, userBD)

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  res.status(200).json(result?.data?.createStripeCustomer?.customer)
}
