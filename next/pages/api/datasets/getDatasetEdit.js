import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getDatasetEdit(id) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allDataset (id: "${id}") {
            edges {
              node {
                _id
                slug
                name
                description
                themes {
                  edges {
                    node {
                      _id
                      name
                    }
                  }
                }
                tags {
                  edges {
                    node {
                      _id
                      name
                    }
                  }
                }
                organization {
                  _id
                  slug
                  name
                }
                version
                status {
                  _id
                  name
                  slug
                }
                isClosed
              }
            }
          }
        }
        `,
        variables: null
      }
    })
    const data = res?.data?.data?.allDataset?.edges[0]?.node
    return data
  } catch (error) {
    console.error(error)
  }
}
