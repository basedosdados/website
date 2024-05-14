import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getAllPeople() {
  const token = await axios({
    url: API_URL,
    method: "POST",
    data: { query: ` mutation { authToken (input: { email: "${process.env.BACKEND_AUTH_EMAIL.trim()}", password: "${process.env.BACKEND_AUTH_PASSWORD.trim()}" }) { token } }` }
  })

  if(token?.data.errors) return ({status: "err_getTeam_0", errors: token.data.errors})
  if(token?.data?.data?.authToken === null) return ({status: "err_getTeam_1"})

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
    if(res?.data?.errors) return {status: "err_getTeam_2", errors: res.data.errors}
    const data = res?.data?.data?.allAccount?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const result = await getAllPeople()

  if(result?.status === "err_getTeam_0") return res.status(500).json({errors: result.errors})
  if(result?.status === "err_getTeam_1") return res.status(500).json({errors: "Erro na geração do token"})
  if(result?.status === "err_getTeam_2") return res.status(500).json({errors: result.errors})

  res.status(200).json(result)
}
