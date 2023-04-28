import axios from "axios";

const API_URL= process.env.NEXT_PUBLIC_API_URL

export default async function getListDatasets() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allDataset {
            edges {
              node {
                _id
              }
            }
          }
        }
        `
      },
      variables: null
    })
    const data = res?.data?.data?.allDataset?.edges.map((res) => res?.node?._id)
    return data
  } catch (error) {
    console.error(error)
  }
}
