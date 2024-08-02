import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getDictionaryTable(id, slug) {
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
                tables (slug: "${slug}") {
                  edges {
                    node {
                      _id
                      slug
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
                    }
                  }
                }
              }
            }
          }
        }
        `
      }
    })
    const data = res?.data?.data?.allDataset?.edges[0]?.node?.tables?.edges[0]?.node
    return data
  } catch (error) {
    console.error(error)
  }
}

export default async function handler(req, res) {
  const param = atob(req.query.p)
  let result = await getDictionaryTable(param, "dicionario")

  if (result === undefined) {
    result = await getDictionaryTable(param, "dictionary")
  }

  if (result === undefined) {
    res.status(500).json({ error: "Nenhum resultado encontrado" })
  } else {
    res.status(200).json(result)
  }
}