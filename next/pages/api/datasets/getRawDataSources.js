import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getRawDataSources(id) {
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
                containsStructureData
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
    const data = res?.data?.data?.allRawdatasource?.edges[0]?.node
    return cleanGraphQLResponse(data)
  } catch (error) {
    console.error(error)
  }
}
