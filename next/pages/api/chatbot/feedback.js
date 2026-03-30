import axios from 'axios'

const API_URL = process.env.CHATBOT_URL

export default async function handler(req, res) {
  const { method } = req
  const authHeader = req.headers.authorization
  const { messageId } = req.query

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  if (!messageId) {
    return res.status(400).json({ error: 'Missing messageId parameter' })
  }

  try {
    if (method === 'PUT') {
      const response = await axios.put(
        `${API_URL}/api/v1/chatbot/messages/${messageId}/feedbacks`,
        req.body,
        {
          headers: { Authorization: authHeader }
        }
      )
      return res.status(200).json(response.data)
    }

    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error(
      `Error in /api/chatbot/feedback [${method}]:`,
      error.response?.data || error.message
    )
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
