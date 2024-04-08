import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function deleteAccount(id) {
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
          DeleteAccount (id: "${id}") { ok }
        }`
      }
    })

    const data = res.data.data.DeleteAccount
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const result = await deleteAccount(atob(req.query.p), token)
  res.status(200).json(result)
}