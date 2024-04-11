import axios from "axios";
import { serialize } from 'cookie';

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function refreshToken(token) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      mutation {
        refreshToken ( token: "${token}" ) {
          payload,
          refreshExpiresIn,
          token
        }
      }`
    }
  })
  try {
    const data = res.data?.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  try {
    const result = await refreshToken(token)
    if(result === "err") {
      res.status(500).json("err")
      return
    }

    res.setHeader('Set-Cookie', serialize('token', result.refreshToken.token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    }))

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json("err")
  }
}
