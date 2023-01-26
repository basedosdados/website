import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export async function getListDatasets() {
  const res = await axios({
    url: baseUrl,
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
  try {
    const data = res.data.data.allDataset.edges.map((res) => res.node._id)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getShowDataset(id) {
  const res = await axios({
    url: baseUrl,
    method: "POST",
    data: {
      query: `
      query {
        allDataset (id: "${id}") {
          edges {
            node {
              id
              slug
              namePt
              nameEn
              organization {
                _id
                slug
                namePt
                nameEn
                website
              }
              informationRequests {
                edges {
                  node {
                    _id
                    slug
                    namePt
                    nameEn
                  }
                }
              }
              rawDataSources {
                edges {
                  node {
                    _id
                    slug
                    namePt
                    nameEn
                  }
                }
              }
              tables {
                edges {
                  node {
                    _id
                    slug
                    namePt
                    nameEn
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
  try {
    const data = res.data.data.allDataset.edges[0].node
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getInformationRequest(id) {
  const res = await axios({
    url: baseUrl,
    method: "POST",
    data: {
      query: `
      query {
        allOrganization (slug: "${id}"){
          edges {
            node {
              _id
              slug
              namePt
              nameEn
              website
            }
          }
        }
      }
      `,
      variables: null
    }
  })
  try {
    const data = res.data.data.allOrganization.edges[0].node
    return data
  } catch (error) {
    console.error(error)
  }
}
