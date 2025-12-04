import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function TableUpadateNotification(user, tableId, token) {
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
          TableUpadateNotification(tableId: "${tableId}", userId: ${user}){
            tableUpdateSubscription {
              id
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.TableUpadateNotification?.tableUpdateSubscription
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

async function DeactivateTableUpadateNotification(user, tableId, token) {
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
          DeactivateTableUpadateNotification(tableId: "${tableId}", userId: ${user}){
            tableUpdateSubscription {
              id
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.DeactivateTableUpadateNotification?.tableUpdateSubscription
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
  const status = atob(req.query.s)

  if(status === "true") {
    const result = await DeactivateTableUpadateNotification(user, tableId, token())

    if(result?.errors) return res.status(500).json({error: result?.errors})
    if(result === "err") return res.status(500).json({error: "err"})

    return res.status(200).json(result)
  } else {
    const result = await TableUpadateNotification(user, tableId, token())

    if(result?.errors) return res.status(500).json({error: result?.errors})
    if(result === "err") return res.status(500).json({error: "err"})

    return res.status(200).json(result)
  }
}
