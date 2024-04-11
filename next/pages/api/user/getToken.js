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
          tokenAuth ( email: "${email}", password: "${password}" ) {
            payload,
            refreshExpiresIn,
            token
          }
        }`
      }
    })
    const data = res.data?.data
    if (data.errors || data.tokenAuth === null) return "err"
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const { a, q } = req.query
  const simple = req.query.s || false

  try {
    const result = await getToken(atob(a), atob(q))
    if(result === "err") {
      res.status(500).json("err")
      return
    }

    if(simple === false) {
      res.setHeader('Set-Cookie', serialize('token', result.tokenAuth.token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      }))
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json("err")
  }
}
