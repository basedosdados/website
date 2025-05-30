import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import { capitalize } from 'lodash';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getTableColumns(id, locale = 'pt') {
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
                      name${capitalize(locale)}
                      coveredByDictionary
                      directoryPrimaryKey {
                        _id
                        name
                        name${capitalize(locale)}
                        table {
                          _id
                          name
                          name${capitalize(locale)}
                          isClosed
                          uncompressedFileSize
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
                            name${capitalize(locale)}
                          }
                        }
                      }
                      description
                      description${capitalize(locale)}
                      bigqueryType {
                        name
                      }
                      temporalCoverage
                      measurementUnit
                      containsSensitiveData
                      observations
                      observations${capitalize(locale)}
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
    });
    const data = res?.data?.data?.allTable?.edges[0]?.node?.columns?.edges;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { id, locale } = req.query;
  const result = await getTableColumns(id, locale);

  if (result === "err") return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({ resource: result, success: true });
}
