import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getBdmTable(id) {
  const token = await axios({
    url: API_URL,
    method: "POST",
    data: { query: ` mutation { authToken (input: { email: "${process.env.BACKEND_AUTH_EMAIL.trim()}", password: "${process.env.BACKEND_AUTH_PASSWORD.trim()}" }) { token } }` }
  })

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.data.data.authToken.token}`
      },
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
                version
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
                fullCoverage
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
                partitions
                publishedBy {
                  firstName
                  lastName
                  website
                  twitter
                  github
                  email
                }
                dataCleanedBy {
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
    const data = res.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const result = await getBdmTable(atob(req.query.p))

  if(result.errors) return res.status(500).json({error: result.errors})
  if(result === "err") return res.status(500).json({error: "err"})

  res.status(200).json(cleanGraphQLResponse(result?.data?.allTable?.edges[0]?.node))
}