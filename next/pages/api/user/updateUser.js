import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updateUser({
  id,
  phone = "",
}, token
) {
  if (!/^\d+$/.test(String(id))) {
    return { errors: [{ field: "id", messages: ["invalid id"] }] }
  }

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
        mutation CreateUpdateAccount($phone: String) {
          CreateUpdateAccount(input: { id: "${id}", phone: $phone }) {
            errors {
              field
              messages
            }
          }
        }`,
        variables: {
          phone: phone === "" ? null : phone
        }
      }
    })

    const data = res.data?.data?.CreateUpdateAccount
    if (data) return data

    return {
      errors: [{
        field: "form",
        messages: res.data?.errors?.map((error) => error.message) || ["update failed"]
      }]
    }
  } catch (error) {
    console.error(error)
    return { errors: [{ field: "form", messages: ["update failed"] }] }
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
