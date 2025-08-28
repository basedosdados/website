import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/tables/stats/`

async function getTablesStats() {
  try {
    const res = await axios({
      url: API_URL,
      method: "GET",
      headers: {
        'Accept': 'application/json',
      }
    })
    return res.data
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { error: "Failed to fetch data" };
  }
}

export default async function handler(req, res) {
  try {
    const result = await getTablesStats();
    
    if (result.error) {
      return res.status(500).json({ error: result.error, success: false });
    }
    
    return res.status(200).json({ result, success: true });
  } catch (error) {
    console.error("Handler Error:", error);
    return res.status(500).json({ error: "Internal server error", success: false });
  }
}