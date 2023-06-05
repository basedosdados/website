import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/search/`

export default async function getSearchDatasets({q, filter, page}) {
  let query = []

  const searchString = () => {
    if(q) return `q=${q}&`
    return ""
  }

  const pageState = () => {
    if(page) return `page=${page}`
    return ""
  }

  const filters = () => {
    if(filter != undefined || null) return null
    if(filter) return (
      filter.forEach(([k, v]) => {
        query.push(`${k}=${v}&`)
      })
    )
  }

  try {
    const res = await axios.get(`${API_URL}?${searchString()}${pageState()}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}
