import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function getInformationRequest(id) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allInformationrequest (id: "${id}"){
            edges {
              node {
                _id
                number
                url
                dataUrl
                observations
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
                status {
                  _id
                  name
                }
              }
            }
          }
        }
        `,
        variables: null
      }
    })
    const data = res?.data
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

export default async function handler(req, res) {
  const result = await getInformationRequest(req.query.p)

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  return res.status(200).json({resource: cleanGraphQLResponse(result?.data?.allInformationrequest?.edges[0]?.node), success: true})
}
