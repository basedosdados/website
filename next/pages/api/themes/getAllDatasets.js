import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/search/`

export default async function getAllDatasets() {
  try {
    const res = await axios.get(API_URL)
    return res.data.results
  } catch (error) {
    console.error(error)
  }
}
