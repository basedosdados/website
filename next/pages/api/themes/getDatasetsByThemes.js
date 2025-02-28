import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/search/`;

export default async function getDatasetsByThemes(req, res) {
  const { themes, locale } = req.query;
  let query = [`locale=${locale || "pt"}`];

  if (Array.isArray(themes)) {
    themes.forEach((element) => {
      query.push(`theme=${encodeURIComponent(element)}`);
    });
  } else if (themes) {
    const themeArray = themes.replace(/[\[\]]/g, "").split(",");
    themeArray.forEach((theme) => {
      query.push(`theme=${encodeURIComponent(theme.trim())}`);
    });
  }

  const fullUrl = `${API_URL}?${query.join("&")}`;

  try {
    const response = await axios.get(fullUrl, { timeout: 5000 });
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error(error);
    return "err";
  }
}
