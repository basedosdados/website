import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getBdmTable(id) {
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
                version
                fullCoverage
                rawDataSource {
                  edges {
                    node {
                      _id
                      name
                      dataset {
                        _id
                      }
                      polls {
                        edges {
                          node {
                            _id
                            latest
                          }
                        }
                      }
                      updates {
                        edges {
                          node {
                            _id
                            latest
                            frequency
                            entity {
                              _id
                              slug
                            }
                          }
                        }
                      }
                    }
                  }
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
                        slug
                      }
                    }
                  }
                }
                isDirectory
                auxiliaryFilesUrl
                uncompressedFileSize
                numberRows
                partitions
                publishedByInfo
                dataCleanedByInfo
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
  const result = await getBdmTable(req.query.p)

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  return res.status(200).json({resource: cleanGraphQLResponse(result?.data?.allTable?.edges[0]?.node), success: true})
}