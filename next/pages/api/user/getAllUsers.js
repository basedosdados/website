import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getAllUsers(token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
          query {
            allAccount {
              edges {
                node {
                  id
                  email
                }
              }
            }
          }
        `
      }
    })
    const data = res.data?.data?.allAccount?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const result = await getAllUsers(token)
  res.status(200).json(result)
}
