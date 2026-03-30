import { request, gql } from 'graphql-request';
import { serialize } from 'cookie';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

const REFRESH_TOKEN = gql`
  mutation refreshToken($token: String!) {
    refreshToken(token: $token) {
      payload
      refreshExpiresIn
      token
    }
  }
`;

async function refreshToken(token) {
  try {
    const response = await request(API_URL, REFRESH_TOKEN, { token });
    return response;
  } catch (error) {
    console.error('refreshToken error:', error);
    return "err";
  }
}

export default async function handler(req, res) {
  if (!req.query.p) {
    return res.status(400).json({ error: 'Missing token parameter', success: false });
  }
  const result = await refreshToken(atob(req.query.p))

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})
  if(result.refreshToken === null) return res.status(500).json({error: "err"})

  res.setHeader('Set-Cookie', serialize('token', result.refreshToken.token, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  }))

  res.status(200).json({ success: true })
}
