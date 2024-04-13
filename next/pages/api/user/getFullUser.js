import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`
const AUTH_TOKEN_FRONT= process.env.AUTH_TOKEN_FRONT

async function getFullUser(email) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN_FRONT}`
      },
      data: {
        query: `
          query {
            allAccount (email : "${email}"){
              edges {
                node {
                  id
                  isAdmin
                  isActive
                  isEmailVisible
                  picture
                  username
                  firstName
                  lastName
                  email
                  website
                  github
                  twitter
                  linkedin
                  proSubscription
                  proSubscriptionRole
                  proSubscriptionSlots
                  proSubscriptionStatus
                }
              }
            }
          }
        `
      }
    })
    const data = res.data?.data?.allAccount?.edges[0]?.node
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const result = await getFullUser(atob(req.query.p))
  res.status(200).json(result)
}
