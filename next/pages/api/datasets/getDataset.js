import axios from "axios";
import { capitalize } from "lodash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getDataset(id, locale = "pt") {
  try {
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
                usageGuide
                name
                name${capitalize(locale)}
                description
                description${capitalize(locale)}
                temporalCoverage
                spatialCoverage
                spatialCoverageName${capitalize(locale)}
                status {
                  slug
                }
                themes {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                    }
                  }
                }
                tags {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                    }
                  }
                }
                organizations {
                  edges {
                    node {
                      _id
                      slug
                      name
                      name${capitalize(locale)}
                      website
                      picture
                    }
                  }
                }
                informationRequests {
                  edges {
                    node {
                      _id
                      number
                      order
                      status {
                        _id
                        slug
                        name
                        name${capitalize(locale)}
                      }
                    }
                  }
                }
                rawDataSources {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                      order
                      status {
                        _id
                        slug
                        name
                        name${capitalize(locale)}
                      }
                    }
                  }
                }
                tables {
                  edges {
                    node {
                      _id
                      name
                      name${capitalize(locale)}
                      slug
                      isClosed
                      order
                      status {
                        _id
                        slug
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
        variables: null,
      },
    });
    const data = res?.data?.data?.allDataset?.edges[0]?.node;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
