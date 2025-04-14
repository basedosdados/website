import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/facet_values/`

export default async function getMoreFacetSearchDatasets(facet, params) {
  try {
    const res = await axios.get(`${API_URL}?facet=${facet}&${params}`)
    return res.data
  } catch (error) {
    console.error(error)
    return {"values": []}
  }
}
