import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import { capitalize } from "lodash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getDataAPIEndpointCategories(locale = "pt") {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allEndpointcategory {
            edges {
              node {
                _id
                slug
                name${capitalize(locale)}
                description${capitalize(locale)}
                createdAt
                updatedAt
              }
            }
          }
        }
        `,
        variables: null,
      },
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { locale } = req.query;
  const result = await getDataAPIEndpointCategories(locale);

  if (result.errors)
    return res.status(500).json({ error: result.errors, success: false });
  if (result === "err")
    return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({
    resource: cleanGraphQLResponse(
      result?.data?.allEndpointcategory?.edges.map((res) => res?.node),
    ),
    success: true,
  });
}
