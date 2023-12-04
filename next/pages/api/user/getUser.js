import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getUser(email) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
          query {
            allAccount (email : "${email}"){
              edges {
                node {
                  isAdmin
                  isActive
                  picture
                  username
                  firstName
                  lastName
                  email
                  currentSubscription
                  currentSubscriptionStatus
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
