import axios from "axios";
import { serialize } from 'cookie';

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getToken(email, password) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        mutation {
          authToken (input: { email: "${email}", password: "${password}" }) {
            user {
              email
              id
            }
            token
          }
        }`
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
  const { a, q } = req.query
  const simple = req.query.s || false

  const result = await getToken(atob(a), atob(q))

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})
  if(result.data.authToken === null) return res.status(500).json({error: "err"})

  if(simple === false) {
    res.setHeader('Set-Cookie', serialize('token', result.data.authToken.token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    }))
  }

  res.status(200).json(result.data.authToken.user)
}
