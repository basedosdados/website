import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export async function getListDatasets() {
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
    console.error("Error fetching datasets:", error)
    return []
  }
}

export default async function handler(req, res) {
  const result = await getListDatasets();
  if (!res) {
    return result;
  }
  if (result.length === 0) {
    return res.status(500).json({ error: "An error occurred", success: false });
  }
  return res.status(200).json({ resource: result, success: true });
}
