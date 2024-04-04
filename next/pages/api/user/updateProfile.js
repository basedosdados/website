import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updateProfile({
  id,
  firstName,
  lastName =  "",
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

  const object = {
    id:req.query.id,
    username:req.query.username,
    firstNam:req.query.firstName,
    lastNam:req.query.lastName,
    isEmailVisibl:req.query.isEmailVisible,
    websit:req.query.website,
    githu:req.query.github,
    twitte:req.query.twitter,
    linkedi:req.query.linkedin,
  }

  const result = await updateProfile(object, token)
  res.status(200).json(result)
}
