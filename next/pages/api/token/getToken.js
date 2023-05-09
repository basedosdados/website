import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getToken({ email, password }) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        mutation {
          tokenAuth ( email: "${email}", password: "${password}" ) {
            payload,
            refreshExpiresIn,
            token
          }
        }`
      }
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
  }
}
