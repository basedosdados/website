import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getAllPeople() {
  const token = await axios({
    url: API_URL,
    method: "POST",
    data: { query: ` mutation { authToken (input: { email: "${process.env.BACKEND_AUTH_EMAIL.trim()}", password: "${process.env.BACKEND_AUTH_PASSWORD.trim()}" }) { token } }` }
  })

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.data.data.authToken.token}`
      },
      data: {
        query: `
        query {
          allAccount (profile: A_1){
            edges {
              node {
                firstName
                lastName
                description
                website
                email
                twitter
                linkedin
                github
                picture
                careers {
                  edges {
                    node {
                      _id
                      team
                      role
                      startAt
                      endAt
                    }
                  }
                }
              }
            }
            edgeCount
          }
        }
        `
      }
    })
    const data = res?.data?.data?.allAccount?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const result = await getAllPeople()
  res.status(200).json(result)
}
