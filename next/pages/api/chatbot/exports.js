import axios from 'axios'

const API_URL = process.env.CHATBOT_URL

export default async function handler(req, res) {
  const { method } = req
  const authHeader = req.headers.authorization
  const rawMessageId = req.query.messageId
  const messageId = Array.isArray(rawMessageId) ? rawMessageId[0] : rawMessageId
  const rawQueryRef = req.query.queryRef
  const queryRef = Array.isArray(rawQueryRef) ? rawQueryRef[0] : rawQueryRef
  const rawFormat = req.query.format
  const format = Array.isArray(rawFormat) ? rawFormat[0] : rawFormat

  if (!API_URL) {
    return res.status(503).json({ error: 'Chatbot API URL is not configured' })
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  if (!messageId || typeof messageId !== 'string') {
    return res.status(400).json({ error: 'Missing messageId parameter' })
  }

  if (!queryRef || typeof queryRef !== 'string') {
    return res.status(400).json({ error: 'Missing queryRef parameter' })
  }

  try {
    if (method === 'POST') {
      const response = await axios.post(
        `${API_URL}/api/v1/chatbot/messages/${encodeURIComponent(messageId)}/exports`,
        null,
        {
          params: { query_ref: queryRef, format: format || 'CSV' },
          headers: { Authorization: authHeader }
        }
      )
      return res.status(200).json(response.data)
    }

    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error(
      `Error in /api/chatbot/exports [${method}]:`,
      error.response?.data || error.message
    )
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
