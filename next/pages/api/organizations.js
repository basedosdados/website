import axios from "axios";
import { API_URL } from "../../configs";

// const API_URL="https://staging.backend.dados.rio/api/v1/graphql"

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