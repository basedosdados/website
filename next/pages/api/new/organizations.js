import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export async function getAllOrganization() {
  const res = await axios({
    url: baseUrl,
    method: "POST",
    data: {
      query: `
      query {
        allOrganization {
          edges {
            node {
              _id
              slug
              namePt
              nameEn
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