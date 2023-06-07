import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getBdmTable(id) {
  try {
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
                isClosed
                dataset {
                  _id
                  slug
                  organization {
                    _id
                    slug
                    area {
                      _id
                      slug
                    }
                  }
                }
                cloudTables{
                  edges{
                    node{
                      gcpTableId
                      gcpDatasetId
                      gcpProjectId
                    }
                  }
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
                updates {
                  edges {
                    node {
                      _id
                      frequency
                      lag
                      latest
                      entity {
                        _id
                        name
                        category {
                          _id
                          name
                        }
                      }
                    }
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
                publishedBy {
                  _id
                  firstName
                  lastName
                  website
                  twitter
                  github
                  email
                }
                dataCleanedBy {
                  _id
                  firstName
                  lastName
                  website
                  twitter
                  github
                  email
                }
                observationLevels {
                  edges {
                    node {
                      _id
                      columns {
                        edges {
                          node {
                            _id
                            name
                          }
                        }
                      }
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
    const data = res?.data?.data?.allTable?.edges[0]?.node
    return cleanGraphQLResponse(data)
  } catch (error) {
    console.error(error)
  }
}
