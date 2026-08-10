import { getTokenFromRequest, serializeTokenCookie } from '../../../lib/authCookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed', success: false })
  }

  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(400).json({ error: 'Missing authentication token', success: false })
  }

  res.setHeader('Set-Cookie', serializeTokenCookie(token))
  res.status(200).json({ success: true })
}
