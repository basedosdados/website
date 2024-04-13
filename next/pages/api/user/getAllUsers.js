import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`
const AUTH_TOKEN_FRONT= process.env.AUTH_TOKEN_FRONT

async function getAllUsers() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN_FRONT}`
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
  const result = await getAllUsers()
  res.status(200).json(result)
}
