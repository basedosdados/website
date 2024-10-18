import axios from "axios";
import { capitalize } from 'lodash';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getAllThemes(locale = 'pt') {
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
  }
}