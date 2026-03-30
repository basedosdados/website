import axios from 'axios'

const API_URL = process.env.CHATBOT_URL

export default async function handler(req, res) {
  const { method } = req
  const authHeader = req.headers.authorization
  const { threadId } = req.query

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  if (!threadId) {
    return res.status(400).json({ error: 'Missing threadId parameter' })
  }

  try {
    if (method === 'GET') {
      const response = await axios.get(`${API_URL}/api/v1/chatbot/threads/${threadId}/messages`, {
        headers: { Authorization: authHeader }
      })
      return res.status(200).json(response.data)
    }

    if (method === 'POST') {
      const response = await axios({
        method: 'POST',
        url: `${API_URL}/api/v1/chatbot/threads/${threadId}/messages`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader
        },
        data: req.body,
        responseType: 'stream'
      })

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      response.data.pipe(res)
      return
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error(
      `Error in /api/chatbot/messages [${method}]:`,
      error.response?.data || error.message
    )
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
