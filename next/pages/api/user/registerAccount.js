import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function registerAccount({
  firstName,
  lastName = "",
  username,
  email,
  password,
}) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        mutation {
          CreateUpdateAccount (input:
            {
              username : "${username}"
              email: "${email}"
              firstName: "${firstName}"
              lastName: "${lastName}"
              password: "${password}"
            }  
          )
          {
            account {
              id,
              email
            }
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
