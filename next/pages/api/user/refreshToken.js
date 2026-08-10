import { request, gql } from 'graphql-request'
import { getTokenFromRequest, serializeTokenCookie } from '../../../lib/authCookie'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(token: $token) {
      payload
      refreshExpiresIn
      token
    }
  }
`

async function refreshToken(token) {
  try {
    const response = await request(API_URL, REFRESH_TOKEN, { token })
    return response
  } catch (error) {
    console.error('refreshToken error:', error)
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

  const result = await refreshToken(token)

  if (result.errors) return res.status(500).json({ error: result.errors, success: false })
  if (result === 'err') return res.status(500).json({ error: 'err', success: false })
  if (result.refreshToken === null) return res.status(500).json({ error: 'err', success: false })

  res.setHeader('Set-Cookie', serializeTokenCookie(result.refreshToken.token))
  res.status(200).json({ success: true })
}
