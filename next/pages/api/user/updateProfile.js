import axios from "axios";
import cookies from "js-cookie";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function updateProfile({
  id,
  firstName,
  lastName =  "",
  isEmailVisible = false,
  website = "",
  github = "",
  twitter = "",
  linkedin = ""
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
              firstName: "${firstName}"
              lastName: "${lastName}"
              isEmailVisible: ${isEmailVisible}
              website: "${website}"
              github: "${github}"
              twitter: "${twitter}"
              linkedin: "${linkedin}"
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
