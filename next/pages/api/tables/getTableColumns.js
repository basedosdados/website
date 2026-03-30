import axios from "axios";
import { validate as isUuid } from "uuid";

async function getTableColumns(id) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tables/${id}/columns/`;

  try {
    const res = await axios({
      url: API_URL,
      method: "GET",
    });
    const data = res?.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || !isUuid(id)) {
    return res.status(400).json({ error: "Invalid or missing ID", success: false });
  }

  const result = await getTableColumns(id);

  if (result === "err") return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({ resource: result, success: true });
}
