import axios from "axios";
import { capitalize } from 'lodash';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getArea(slug, locale) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allArea (slug: "${slug}") {
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
    const data = res?.data?.data?.allArea?.edges;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(req, res) {
  const { slug, locale = 'pt' } = req.query;
  const result = await getArea(slug, locale);

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  return res.status(200).json({resource: result, success: true})
}