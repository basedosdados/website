import { serialize } from 'cookie'

const TokenMaxAge = 60 * 60 * 24 * 7

function cookieBaseOptions(extra = {}) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...extra,
  }
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers?.authorization
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim()
    if (bearer) return bearer
  }

  const cookieToken = req.cookies?.token
  if (cookieToken && String(cookieToken).trim()) {
    return String(cookieToken).trim()
  }

  const bodyToken = req.body?.token
  if (bodyToken && String(bodyToken).trim()) {
    return String(bodyToken).trim()
  }

  return null
}

export function getAuthorizationHeader(req) {
  const token = getTokenFromRequest(req)
  return token ? `Bearer ${token}` : null
}

export function serializeTokenCookie(token, { maxAge = TokenMaxAge } = {}) {
  return serialize("token", token, cookieBaseOptions({ maxAge }));
}

export function serializeClearedTokenCookie() {
  return serialize('token', '', cookieBaseOptions({ maxAge: -1 }))
}
