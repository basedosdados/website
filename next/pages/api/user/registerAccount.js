import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function registerAccount({
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
        mutation CreateUpdateAccount($input: CreateUpdateAccountInput!) {
          CreateUpdateAccount(input: $input) {
            account {
              id
              email
            }
            errors {
              field
              messages
            }
          }
        }`,
        variables: {
          input: {
            username, email, firstName, lastName, password
          }
        }
      }
    })
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const { f, l, u, e, p } = req.query
  
  const object = {
    firstName: Buffer.from(f, 'base64').toString('utf-8'),
    lastName: Buffer.from(l, 'base64').toString('utf-8'),
    username: Buffer.from(u, 'base64').toString('utf-8'),
    email: Buffer.from(e, 'base64').toString('utf-8'),
    password: Buffer.from(p, 'base64').toString('utf-8')
  }

  function replaceNullsWithEmpty(obj) {
    for (let [key, value] of Object.entries(obj)) {
      if (value === "null" || value === null) {
        obj[key] = ""
      }
    }
    return obj
  }

  const result = await registerAccount(replaceNullsWithEmpty(object))

  if(result?.errors) return res.status(500).json({error: "err", success: false, message: result.errors})
  if(result?.data?.CreateUpdateAccount === null) return res.status(500).json({error: "err", success: false})
  if(result?.data?.CreateUpdateAccount.errors.length > 0) return res.status(500).json({errors: result.data.CreateUpdateAccount.errors, success: false })
  if(result === "err") return res.status(500).json({error: "err", success: false })

  res.status(200).json({ success: true })
}
