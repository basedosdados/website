import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updatePassword({
  id,
  password,
},token
) {
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
              password: "${password}"
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

export default async function handler(req, res) {
  const token = req.cookies.token

  const object = {
    id: atob(req.query.b),
    password: atob(req.query.p)
  }

  const result = await updatePassword(object, token)
  res.status(200).json(result)
}

