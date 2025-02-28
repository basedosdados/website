import axios from "axios";
import { serialize } from "cookie";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function refreshToken(token) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      mutation {
        refreshToken ( token: "${token}" ) {
          payload,
          refreshExpiresIn,
          token
        }
      }`,
    },
  });
  try {
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const result = await refreshToken(atob(req.query.p));

  if (result.errors) return res.status(500).json({ error: result.errors });
  if (result === "err") return res.status(500).json({ error: "err" });
  if (result.data.refreshToken === null)
    return res.status(500).json({ error: "err" });

  res.setHeader(
    "Set-Cookie",
    serialize("token", result.data.refreshToken.token, {
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    }),
  );

  res.status(200).json({ success: true });
}
