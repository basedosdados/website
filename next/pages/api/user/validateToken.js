import { request, gql } from 'graphql-request'
import { getTokenFromRequest } from '../../../lib/authCookie'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`

async function validateToken(token) {
  try {
    const response = await request(API_URL, VERIFY_TOKEN, { token })
    return response
  } catch (error) {
    console.error('validateToken error:', error)
    return 'err'
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ error: 'Method not allowed', success: false })
  }

  const token = getTokenFromRequest(req)
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token', success: false })
  }

  const result = await validateToken(token)

  if (result.errors) return res.status(500).json({ error: result.errors, success: false })
  if (result === 'err') return res.status(500).json({ error: 'err', success: false })
  if (result.verifyToken === null) return res.status(500).json({ error: 'err', success: false })

  let payload = result.verifyToken?.payload
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      payload = {}
    }
  }
  const has_chatbot_access = payload?.has_chatbot_access === true

  res.status(200).json({ success: true, has_chatbot_access })
}
