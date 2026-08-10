import { serializeClearedTokenCookie } from '../../../lib/authCookie'

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed', success: false })
  }

  res.setHeader('Set-Cookie', serializeClearedTokenCookie())
  res.status(200).json({ success: true })
}
