import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function validateToken(token) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      mutation {
        verifyToken ( token: "${token}" ) {
          payload,
        }
      }`
    }
  })
  try {
    const data = res.data.data
    if (data?.verifyToken === null) return "err"
    return data.verifyToken
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  try {
    const result = await validateToken(atob(req.query.p))
    if(result === "err") {
      res.status(500).json("err")
      return
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json("err")
  }
}