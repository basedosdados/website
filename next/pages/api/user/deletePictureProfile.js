import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function deletePictureProfile(id, token) {
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
          DeleteAccountPictureMutation (id: "${id}") {
            ok
          }
        }`
      }
    })

    const data = res?.data?.data?.DeleteAccountPictureMutation
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const result = await deletePictureProfile(atob(req.query.p), token)
  res.status(200).json(result)
}