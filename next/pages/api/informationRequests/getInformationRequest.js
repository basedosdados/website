import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import { capitalize } from "lodash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getInformationRequest(id, locale = "pt") {
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
                observations${capitalize(locale)}
                status {
                  slug
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
                        name${capitalize(locale)}
                      }
                    }
                  }
                }
                status {
                  _id
                  name
                  name${capitalize(locale)}
                }
              }
            }
          }
        }
        `,
        variables: null,
      },
    });
    const data = res?.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { id: id, locale } = req.query;
  const result = await getInformationRequest(id, locale);

  if (result.errors)
    return res.status(500).json({ error: result.errors, success: false });
  if (result === "err")
    return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({
    resource: cleanGraphQLResponse(
      result?.data?.allInformationrequest?.edges[0]?.node,
    ),
    success: true,
  });
}
