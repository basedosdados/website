import axios from "axios";
import { cleanGraphQLResponse } from "../../utils";

const API_URL= process.env.NEXT_PUBLIC_API_URL

export async function getListDatasets() {
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
  try {
    const data = res?.data?.data?.allDataset?.edges.map((res) => res?.node?._id)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getAllDatasets(offset) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allDataset (first: 10, offset: ${offset || 0}){
          edges {
            node {
              _id
              slug
              name
              themes {
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
                website
              }
              informationRequests {
                edges {
                  node {
                    _id
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
    const data = res?.data?.data?.allDataset?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getShowDataset(id) {
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
                website
              }
              informationRequests {
                edges {
                  node {
                    _id
                    slug
                  }
                }
              }
              rawDataSources {
                edges {
                  node {
                    _id
                    name
                  }
                }
              }
              tables {
                edges {
                  node {
                    _id
                    name
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
  try {
    const data = res?.data?.data?.allDataset?.edges[0]?.node
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getBdmTable(id) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allTable (id: "${id}") {
          edges {
            node {
              _id
              slug
              name
              description
              dataset {
                _id
                slug
              }
              coverages {
                edges {
                  node {
                    _id
                    datetimeRanges {
                      edges {
                        node {
                          _id
                          startYear
                          startSemester
                          startQuarter
                          startMonth
                          startDay
                          startHour
                          startMinute
                          startSecond
                          endYear
                          endSemester
                          endQuarter
                          endMonth
                          endDay
                          endHour
                          endMinute
                          endSecond
                          interval
                        }
                      }
                    }
                  }
                }
              }
              license {
                _id
                name
                url
              }
              updateFrequency {
                _id
                number
                entity {
                  _id
                  name
                }
              }
              pipeline {
                _id
                githubUrl
              }
              isDirectory
              dataCleaningDescription
              dataCleaningCodeUrl
              rawDataUrl
              auxiliaryFilesUrl
              architectureUrl
              sourceBucketName
              uncompressedFileSize
              compressedFileSize
              numberRows
              numberColumns
              observationLevel {
                edges {
                  node {
                    _id
                    entity {
                      _id
                      name
                    }
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
    const data = res?.data?.data?.allTable?.edges[0]?.node
    return cleanGraphQLResponse(data)
  } catch (error) {
    console.error(error)
  }
}

export async function getColumnsBdmTable(id) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allTable (id: "${id}"){
          edges {
            node {
              _id
              columns {
                edges {
                  node {
                    _id
                    name
                    bigqueryType {
                      name
                    }
                    description
                    coverages {
                      edges {
                        node {
                          datetimeRanges {
                            edges {
                              node {
                                _id
                                startYear
                                startSemester
                                startQuarter
                                startMonth
                                startDay
                                startHour
                                startMinute
                                startSecond
                                endYear
                                endSemester
                                endQuarter
                                endMonth
                                endDay
                                endHour
                                endMinute
                                endSecond
                                interval
                              }
                            }
                          }
                        }
                      }
                    }
                    coveredByDictionary
                    directoryPrimaryKey {
                      _id
                      name
                      table {
                        _id
                        slug
                        dataset {
                          _id
                          slug
                        }
                      }
                    }
                    measurementUnit
                    containsSensitiveData
                    observations
                  }
                }
              }
            }
          }
        }
      }
      `
    },
    variables: null
  })
  try {
    const data = res?.data?.data?.allTable?.edges[0]?.node?.columns?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function getRawDataSources(id) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allRawdatasource (id: "${id}") {
          edges {
            node {
              _id
              name
              description
              url
              languages {
                edges {
                  node {
                    _id
                    name
                  }
                }
              }
              availability {
                _id
                name
              }
              containsStructureData
              containsApi
              updateFrequency {
                _id
                entity {
                  _id
                  name
                }
                number
              }
              entities {
                edges {
                  node {
                    _id
                    name
                  }
                }
              }
              requiredRegistration
              areaIpAddressRequired {
                edges {
                  node {
                    _id
                    name
                  }
                }
              }
              isFree
              license {
                _id
                url
                name
              }
              coverages {
                edges {
                  node {
                    _id
                    area {
                      _id
                      name
                    }
                    datetimeRanges {
                      edges {
                        node {
                          _id
                          startYear
                          startSemester
                          startQuarter
                          startMonth
                          startDay
                          startHour
                          startMinute
                          startSecond
                          endYear
                          endSemester
                          endQuarter
                          endMonth
                          endDay
                          endHour
                          endMinute
                          endSecond
                          interval
                        }
                      }
                    }
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
    const data = res?.data?.data?.allRawdatasource?.edges[0]?.node
    return cleanGraphQLResponse(data)
  } catch (error) {
    console.error(error)
  }
}

export async function getInformationRequest(id) {
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
      query {
        allInformationrequest (id: "${id}"){
          edges {
            node {
              _id
              slug
              url
              dataUrl
              origin
              observations
              updateFrequency {
                _id
                number
              }
              status {
                _id
                name
              }
              coverages {
                edges {
                  node {
                    _id
                    datetimeRanges {
                      edges {
                        node {
                          _id
                          startYear
                          startSemester
                          startQuarter
                          startMonth
                          startDay
                          startHour
                          startMinute
                          startSecond
                          endYear
                          endSemester
                          endQuarter
                          endMonth
                          endDay
                          endHour
                          endMinute
                          endSecond
                          interval
                        }
                      }
                    } 
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
    const data = res?.data?.data?.allInformationrequest?.edges[0]?.node
    return cleanGraphQLResponse(data)
  } catch (error) {
    console.error(error)
  }
}
