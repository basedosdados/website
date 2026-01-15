import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function DeactivateAllTableUpadateNotifications(user, token) {
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
          DeactivateAllTableUpadateNotification(userId: ${user}){
            success
            deactivatedCount
          }
        }
        `
      }
    })
    const data = res?.data?.data?.DeactivateAllTableUpadateNotification
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = () => {
    return req.cookies.token
  }

  const user = atob(req.query.p)

  const result = await DeactivateAllTableUpadateNotifications(user, token())

  if(result?.errors) return res.status(500).json({error: result?.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  return res.status(200).json(result)
}
