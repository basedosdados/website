import axios from "axios";

const API_URL= process.env.NEXT_PUBLIC_API_URL

export async function getAllOrganization() {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allOrganization {
          edges {
            node {
              _id
              slug
              name
              website
            }
          }
        }
      }
      `,
      variables: null
    }
  })
  try {
    const data = res.data.data.allOrganization.edges
    return data
  } catch (error) {
    console.error(error)
  }
}