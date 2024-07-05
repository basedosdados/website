import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getColumnsBdmTable(id) {
  try {
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
                      order
                      name
                      coveredByDictionary
                      directoryPrimaryKey {
                        _id
                        name
                        table {
                          _id
                          name
                          cloudTables{
                            edges{
                              node{
                                gcpTableId
                                gcpDatasetId
                                gcpProjectId
                              }
                            }
                          }
                          dataset {
                            _id
                            name
                          }
                        }
                      }
                      description
                      bigqueryType {
                        name
                      }
                      coverage
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
    const data = res?.data?.data?.allTable?.edges[0]?.node?.columns?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}
