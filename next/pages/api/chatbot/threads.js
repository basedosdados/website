import axios from 'axios'

const API_URL = process.env.CHATBOT_URL

export default async function handler(req, res) {
  const { method } = req
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  try {
    if (method === 'GET') {
      const response = await axios.get(`${API_URL}/api/v1/chatbot/threads`, {
        headers: { Authorization: authHeader }
      })
      return res.status(200).json(response.data)
    }

    if (method === 'POST') {
      const response = await axios.post(`${API_URL}/api/v1/chatbot/threads`, req.body, {
        headers: { Authorization: authHeader }
      })
      return res.status(201).json(response.data)
    }

    if (method === 'DELETE') {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: 'Missing thread id' })

      const response = await axios.delete(`${API_URL}/api/v1/chatbot/threads/${id}`, {
        headers: { Authorization: authHeader }
      })
      return res.status(200).json(response.data)
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error(
      `Error in /api/chatbot/threads [${method}]:`,
      error.response?.data || error.message
    )
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
