import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/search/`;

export async function getAllDatasets(locale = 'pt') {
  try {
    const res = await axios.get(API_URL, {
      params: { locale },
    });
    return res.data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(req, res) {
  const { locale } = req.query || { locale: 'pt' };
  const result = await getAllDatasets(locale);

  if (result === null) {
    return res.status(500).json({ error: "An error occurred", success: false });
  }

  return res.status(200).json({ resource: result, success: true });
}
