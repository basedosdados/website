import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/search/`

export default async function getSearchDatasets({filter = [], page, locale}) {
  const pageState = () => {
    if(page) return `page=${page}`
    return ""
  }

  const filters = () => {
    const queryFilter = []
    if(filter === undefined || null) return ""
    if(filter.length > 0) (
      filter.forEach(([k, v]) => {
        queryFilter.push(`${k}=${v}&`)
      })
    )
    
    return queryFilter.join("")
  }

  try {
    const res = await axios.get(`${API_URL}?${filters()}${pageState()}&locale=${locale}`)
    return res.data
  } catch (error) {
    console.error(error)
  }
}
