import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function validateToken(token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        mutation {
          verifyToken ( token: "${token}" ) {
            payload,
          }
        }`,
      },
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const result = await validateToken(atob(req.query.p));

  if (result.errors)
    return res.status(500).json({ error: result.errors, success: false });
  if (result === "err")
    return res.status(500).json({ error: "err", success: false });
  if (result.data.verifyToken === null)
    return res.status(500).json({ error: "err", success: false });

  res.status(200).json({ success: true });
}
