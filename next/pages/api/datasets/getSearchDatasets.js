import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/search/`

export default async function getSearchDatasets({q, filter = {}, page}) {
  let query = []

  const searchString = () => {
    if(q) return `q=${q}&`
    return ""
  }

  const pageState = () => {
    if(page) return `page=${page}`
    return ""
  }

  // filter.forEach(element => {
  //   query.push(`theme=${element}`)
  // });

  try {
    const res = await axios.get(`${API_URL}?${searchString()}${pageState()}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}
