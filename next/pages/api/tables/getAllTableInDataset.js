import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getAllTableInDataset(dataset) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allTable (dataset_Id: "${dataset}"){
            edges {
              node {
                _id
                name
              }
            }
          }
        }
        `,
        variables: null,
      },
    });
    const data = res?.data?.data?.allTable?.edges;
    return data;
  } catch (error) {
    console.error(error);
  }
}
