import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getIdUser(email) {
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
        query: `query { allAccount (email: "${email}") {edges{node{id}}} }`
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
  const result = await getIdUser(atob(req.query.p))

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})
  if(result?.data?.allAccount?.edges.length === 0) return res.status(500).json({error: "err"})

  res.status(200).json(result?.data?.allAccount?.edges[0]?.node)
}
