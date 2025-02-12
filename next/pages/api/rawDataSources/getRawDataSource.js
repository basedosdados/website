import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import { capitalize } from 'lodash';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getRawDataSource(id, locale = 'pt') {
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
                name${capitalize(locale)}
                description
                description${capitalize(locale)}
                url
                languages {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                    }
                  }
                }
                availability {
                  _id
                  name
                  name${capitalize(locale)}
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
                        name${capitalize(locale)}
                        category {
                          _id
                          name
                          name${capitalize(locale)}
                        }
                      }
                    }
                  }
                }
                observationLevels {
                  edges {
                    node {
                      _id
                      order
                      columns {
                        edges {
                          node {
                            _id
                            name
                            name${capitalize(locale)}
                          }
                        }
                      }
                      entity {
                        _id
                        name
                        name${capitalize(locale)}
                      }
                    }
                  }
                }
                requiresRegistration
                areaIpAddressRequired {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                    }
                  }
                }
                isFree
                license {
                  _id
                  url
                  name
                  name${capitalize(locale)}
                }
                coverages {
                  edges {
                    node {
                      _id
                      area {
                        _id
                        name
                        name${capitalize(locale)}
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
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { id: id, locale } = req.query;
  const result = await getRawDataSource(id, locale);

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  return res.status(200).json({resource: cleanGraphQLResponse(result?.data?.allRawdatasource?.edges[0]?.node), success: true})
}
