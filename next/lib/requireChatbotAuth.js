import { request, gql } from 'graphql-request'
import { getTokenFromRequest } from './authCookie'

const ApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

const VerifyTokenMutation = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`

function parsePayload(raw) {
  let payload = raw
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      payload = {}
    }
  }
  return payload && typeof payload === 'object' ? payload : {}
}

export async function verifySessionToken(token) {
  if (!token) {
    return { valid: false, has_chatbot_access: false, payload: null }
  }

  try {
    const result = await request(ApiUrl, VerifyTokenMutation, { token })
    if (!result?.verifyToken) {
      return { valid: false, has_chatbot_access: false, payload: null }
    }

    const payload = parsePayload(result.verifyToken.payload)
    return {
      valid: true,
      has_chatbot_access: payload?.has_chatbot_access === true,
      payload,
    }
  } catch (error) {
    console.error('verifySessionToken error:', error)
    return { valid: false, has_chatbot_access: false, payload: null }
  }
}

export async function requireChatbotAuth(req) {
  const token = getTokenFromRequest(req)
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Missing authentication token',
    }
  }

  const verified = await verifySessionToken(token)
  if (!verified.valid) {
    return {
      ok: false,
      status: 401,
      error: 'Invalid or expired token',
    }
  }

  if (!verified.has_chatbot_access) {
    return {
      ok: false,
      status: 403,
      error: 'Chatbot access required',
    }
  }

  return {
    ok: true,
    authHeader: `Bearer ${token}`,
    payload: verified.payload,
  }
}
