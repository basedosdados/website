import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function registerAccount({
  userName,
  firstName,
  lastName,
  email,
  password,
}) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer `
      },
      data: {
        query: `
        mutation {
          CreateUpdateAccount (input:
            {
              username : "${userName}"
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
