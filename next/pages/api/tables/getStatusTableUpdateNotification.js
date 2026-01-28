import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getStatusTableUpdateNotification(user, tableId, token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
        query {
          statusTableUpdateNotification(tableId: "${tableId}", userId: ${user}){
            status
          }
        }
        `
      }
    })
    const data = res?.data?.data?.statusTableUpdateNotification
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
  const tableId = atob(req.query.q)

  const result = await getStatusTableUpdateNotification(user, tableId, token())

  if(result?.errors) return res.status(500).json({error: result?.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  res.status(200).json(result)
}
