import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export function getListDatasets() {
  return axios
    .get(`https://staging.backend.dados.rio/api/v1/public/datasets/`)
    .then(({ data }) => data.results);
}

export async function getShowDataset(id) {
  const res = await axios({
    url: baseUrl,
    method: "post",
    data: {
      query: `
      query {
        allDataset (slug: "${id}"){
          edges {
            node {
              id
              slug
              namePt
              nameEn
              organization {
                slug
              }
              informationRequests {
                edges {
                  node {
                    slug
                    namePt
                    nameEn
                  }
                }
              }
              rawDataSources {
                edges {
                  node {
                    slug
                    namePt
                    nameEn
                  }
                }
              }
              tables {
                edges {
                  node {
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

export async function getAllOrganization() {
  const res = await axios({
    url: baseUrl,
    method: "post",
    data: {
      query: `
      query {
        allOrganization {
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
    const data = res.data.data.allOrganization.edges
    return data
  } catch (error) {
    console.error(error)
  }
}


export async function getOrganizationById(id) {
  const res = await axios({
    url: baseUrl,
    method: "post",
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

export async function getInformationRequest(id) {
  const res = await axios({
    url: baseUrl,
    method: "post",
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
