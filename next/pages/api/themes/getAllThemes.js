import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import { capitalize } from 'lodash';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getAllThemes(locale = 'pt') {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allTheme {
            edges {
              node {
                _id
                slug
                name
                name${capitalize(locale)}
              }
            }
          }
        }
        `,
        variables: null
      }
    });
    const data = res?.data?.data?.allTheme?.edges;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { locale = 'pt' } = req.query;
  const result = await getAllThemes(locale);

  if (result === "err") return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({ resource: cleanGraphQLResponse(result), success: true });
}