import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function updateProfileSurvey({
  id,
  workArea,
  workRole,
  availableForResearch
}, token, skip
) {
  const query = skip === "true" ?
    `
      mutation {
        CreateUpdateAccount (input:
          {
            id: "${id}"
            availableForResearch: "NO"
            workArea: null
            workRole: null
          }  
        )
        {
          errors {
            field,
            messages
          }
        }
    }`
  :
    `
      mutation {
        CreateUpdateAccount (input:
          {
            id: "${id}"
            workArea: "${workArea}"
            workRole: "${workRole}"
            availableForResearch: "${availableForResearch}"
          }  
        )
        {
          errors {
            field,
            messages
          }
        }
    }`

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: query
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

  const { p, f, l, e, s} = req.query

  const object = {
    id:atob(p),
    workArea:atob(f),
    workRole:atob(l),
    availableForResearch:atob(e),
  }

  const result = await updateProfileSurvey(object, token, s)
  res.status(200).json(result)
}
