import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function startChatbotTrial({id, token}) {
  const query = `
    mutation {
      startChatbotTrial (priceId: ${id}) {
        chatbotTrialEndsAt
        errors
      }
    }
  `

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
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token
  const result = await startChatbotTrial({
    id: atob(req.query.p),
    token: token
  })

  if(result === "err") return res.status(200).json({started: false})
  if(result.errors) return res.status(200).json({started: false})

  const trial = result?.data?.startChatbotTrial
  if(!trial || (trial.errors && trial.errors.length > 0)) return res.status(200).json({started: false})

  res.status(200).json({started: true, chatbotTrialEndsAt: trial.chatbotTrialEndsAt})
}
