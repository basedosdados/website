import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getRawDataSources(id) {
  try {
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
                containsStructuredData
                containsApi
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
  const result = await getRawDataSources(req.query.p)

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  return res.status(200).json({resource: cleanGraphQLResponse(result?.data?.allRawdatasource?.edges[0]?.node), success: true})
}
