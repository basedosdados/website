import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updateProfile({
  id,
  firstName,
  lastName = "",
  isEmailVisible = false,
  website = "",
  github = "",
  twitter = "",
  linkedin = ""
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

    const data = res?.data?.data?.CreateUpdateAccount
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token

  const { p, f, l, e, w, g, t, li } = req.query

  const object = {
    id:atob(p),
    firstName:atob(f),
    lastName:atob(l),
    isEmailVisible:atob(e),
    website:atob(w),
    github:atob(g),
    twitter:atob(t),
    linkedin:atob(li),
  }

  function replaceNullsWithEmpty(obj) {
    for (let [key, value] of Object.entries(obj)) {
      if (value === "null" || value === null) {
        obj[key] = ""
      }
    }
    return obj
  }

  const result = await updateProfile(replaceNullsWithEmpty(object), token)
  res.status(200).json(result)
}
