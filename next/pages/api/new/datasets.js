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
              _id
              slug
              name
              namePt
              nameEn
              description
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

export async function getBdmTable(id) {
  const res = await axios({
    url: baseUrl,
    method: "POST",
    data: {
      query: `
      query {
        allTable (id: "${id}") {
          edges {
            node {
              _id
              createdAt
              updatedAt
              nameEn
              namePt
              description
              isDirectory
              dataCleanedDescription
              dataCleanedCodeUrl
              rawDataUrl
              auxiliaryFilesUrl
              architectureUrl
              sourceBucketName
              uncompressedFileSize
              compressedFileSize
              numberOfRows
              columns {
                edges{
                  node {
                    _id
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
    const data = res.data.data.allTable.edges[0].node
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getRawDataSources(id) {
  const res = await axios({
    url: baseUrl,
    method: "POST",
    data: {
      query: `
      query {
        allRawdatasource (id: "${id}"){
          edges {
            node {
              _id
              name
              namePt
              nameEn
              description
              rawDataUrl
              auxiliaryFilesUrl
              languages {
                edges {
                  node {
                    name
                    namePt
                    nameEn
                  }
                }
              }
              availability {
                name
                namePt
                nameEn
              }
              coverages {
                edges {
                  node {
                    temporalCoverage
                  }
                }
              }
              languages {
                edges {
                  node {
                    id
                  }
                }
              }
              license {
                name
                namePt
                nameEn
              }
              updateFrequency {
                timeUnit {
                  name
                  namePt
                  nameEn
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
    const data = res.data.data.allRawdatasource.edges[0].node
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
        allInformationrequest (id: "${id}"){
          edges {
            node {
              _id
              name
              namePt
              nameEn
              status {
                namePt
                nameEn
              }
              coverages {
                edges {
                  node {
                    temporalCoverage
                  }
                }
              }
              description
              observations
              rawDataUrl
              auxiliaryFilesUrl
            }
          }
        }
      }
      `,
      variables: null
    }
  })
  try {
    const data = res.data.data.allInformationrequest.edges[0].node
    return data
  } catch (error) {
    console.error(error)
  }
}
