import { getTokenFromRequest } from '../../../lib/authCookie'
import { verifySessionToken } from '../../../lib/requireChatbotAuth'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed', success: false })
  }

  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token', success: false })
  }

  const verified = await verifySessionToken(token)
  if (!verified.valid) {
    return res.status(401).json({ error: 'Invalid or expired token', success: false })
  }

  res.status(200).json({
    success: true,
    has_chatbot_access: verified.has_chatbot_access,
  })
}
