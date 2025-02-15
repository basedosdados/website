import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/account/account_activate_confirm`;

async function activeAccount(id, token) {
  try {
    const res = await axios.post(`${API_URL}/${id}/${token}/`);
    return res;
  } catch (error) {
    console.error(error);
  }
}

export default async function handler(req, res) {
  const { q, p } = req.query;

  const result = await activeAccount(q, p);
  res.status(200).json({ success: true });
  res.status(500).json({ success: false });
}
