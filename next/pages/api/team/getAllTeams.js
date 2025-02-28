import axios from "axios";
import { capitalize } from "lodash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getAllTeams(locale = "pt") {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
          query {
            allTeam {
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
      },
    });
    const result = res?.data?.data?.allTeam?.edges;
    return result;
  } catch (error) {
    console.error(error);
  }
}

export default async function handler(req, res) {
  const { locale } = req.query;
  try {
    const teams = await getAllTeams(locale);

    if (!teams) {
      return res.status(500).json({ error: "No teams found", success: false });
    }

    return res.status(200).json({ resource: teams, success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
}
