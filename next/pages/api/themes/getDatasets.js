import axios from "axios";

const API_URL= process.env.NEXT_PUBLIC_API_URL

export default async function getAllDatasets(offset) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allDataset (first: 10){
            edges {
              node {
                _id
                slug
                name
                tags (first: 3) {
                  edges {
                    node {
                      _id
                      name
                      slug
                    }
                  }
                }
                themes (first: 3) {
                  edges {
                    node {
                      _id
                      slug
                      name
                    }
                  }
                }
                organization {
                  _id
                  slug
                  name
                }
                informationRequests {
                  edges {
                    node {
                      _id
                      number
                    }
                  }
                }
                rawDataSources {
                  edges {
                    node {
                      _id
                    }
                  }
                }
                tables {
                  edges {
                    node {
                      _id
                      slug
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: null
      }
    })
    const data = res?.data?.data?.allDataset.edges
    return data
  } catch (error) {
    console.error(error)
  }
}
