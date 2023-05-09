import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/search/`

export default async function getDatasetsByThemes(themes) {
  let query = []

  themes.forEach(element => {
    query.push(`theme=${element}`)
  });

  try {
    const res = await axios.get(`${API_URL}?${query.join("&")}`)
    return res.data.results
  } catch (error) {
    console.error(error)
  }
}
