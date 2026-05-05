import { request, gql } from 'graphql-request';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
    }
  }
`;

async function validateToken(token) {
  try {
    const response = await request(API_URL, VERIFY_TOKEN, { token });
    return response;
  } catch (error) {
    console.error('validateToken error:', error);
    return "err";
  }
}

export default async function handler(req, res) {
  if (!req.query.p) {
    return res.status(400).json({ error: 'Missing token parameter', success: false });
  }
  const result = await validateToken(atob(req.query.p))

  if(result.errors) return res.status(500).json({error: result.errors, success: false })
  if(result === "err") return res.status(500).json({error: "err", success: false })
  if(result.verifyToken === null) return res.status(500).json({error: "err", success: false})

  res.status(200).json({ success: true })
}