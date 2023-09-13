import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getAllTeams() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
        
        }
        `
      }
    })
    const data = res?.data?.data?.allBdgroup?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}
