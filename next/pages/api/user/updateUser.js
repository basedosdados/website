import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updateUser({
  id,
  phone = "",
}, token
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
        mutation CreateUpdateAccount($input: CreateUpdateAccountInput!) {
          CreateUpdateAccount(input: $input) {
            errors {
              field
              messages
            }
          }
        }`,
        variables: {
          input: {
            id,
            phone: phone === "" ? null : phone
          }
        }
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
    id: atob(req.query.p),
    phone: req.query.q ? atob(req.query.q) : ""
  }

  const result = await updateUser(object, token)
  res.status(200).json(result)
}
