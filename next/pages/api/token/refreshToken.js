import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function refreshToken({ token }) {
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
    const data = res.data.data.refreshToken
    return data
  } catch (error) {
    console.error(error)
  }
}
