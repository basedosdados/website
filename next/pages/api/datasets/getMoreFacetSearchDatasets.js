import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/facet_values/`

export default async function getMoreFacetSearchDatasets(facet, params, locale) {
  try {
    const localeParam = locale ? `&locale=${locale}` : ""
    const res = await axios.get(`${API_URL}?facet=${facet}&${params}${localeParam}`)
    return res.data
  } catch (error) {
    console.error(error)
    return {"values": []}
  }
}
