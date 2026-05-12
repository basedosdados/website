import axios from 'axios'
import { pipeline } from 'stream/promises'

const API_URL = process.env.CHATBOT_URL

function bufferStreamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    stream.on('error', reject)
  })
}

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
          Authorization: authHeader,
          'Accept-Encoding': 'identity'
        },
        data: req.body,
        responseType: 'stream',
        validateStatus: () => true
      })

      if (response.status >= 400) {
        const errorBody = await bufferStreamToString(response.data)
        try {
          return res.status(response.status).json(JSON.parse(errorBody))
        } catch {
          return res.status(response.status).send(errorBody || 'Upstream error')
        }
      }

      res.status(200)
      res.setHeader('Content-Type', 'application/x-ndjson')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no')

      if (typeof res.flushHeaders === 'function') {
        res.flushHeaders()
      }

      try {
        await pipeline(response.data, res)
      } catch (streamErr) {
        console.error('chatbot messages stream pipeline:', streamErr)
        if (!res.writableEnded) {
          try {
            res.destroy()
          } catch (_) {}
        }
      }
      return
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error(
      `Error in /api/chatbot/messages [${method}]:`,
      error.response?.data || error.message
    )
    if (res.headersSent || res.writableEnded) {
      return
    }
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
