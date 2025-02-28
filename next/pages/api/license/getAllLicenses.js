import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getAllLicenses() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allLicense {
            edges {
              node {
                _id
                slug
              }
            }
          }
        }
        `,
      },
      variables: null,
    });
    const data = res?.data?.data?.allLicense?.edges;
    return data;
  } catch (error) {
    console.error(error);
  }
}
