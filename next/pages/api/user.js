import axios from "axios";

const API_URL= process.env.NEXT_PUBLIC_API_URL

export async function getToken({ email, password }) {
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

export async function validateToken({ token }) {
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
    const data = res.data.data.verifyToken
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function refreshToken({ token }) {
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


