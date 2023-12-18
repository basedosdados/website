import axios from "axios";
import cookies from "js-cookie";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function updateUser({
  id,
  email,
  username,
}) {
  let token = cookies.get("token") || ""

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
          CreateUpdateAccount (input:
            {
              id: "${id}"
              email: "${email}"
              username: "${username}"
            }  
          )
          {
            errors {
              field,
              messages
            }
          }
        }`
      }
    })
    const data = res.data.data.CreateUpdateAccount
    return data
  } catch (error) {
    console.error(error)
  }
}
