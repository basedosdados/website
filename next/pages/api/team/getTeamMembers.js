import axios from "axios";
import { capitalize } from "lodash";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getTeamMembers(team, locale = "pt") {
  const token = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: ` mutation { authToken (input: { email: "${process.env.BACKEND_AUTH_EMAIL.trim()}", password: "${process.env.BACKEND_AUTH_PASSWORD.trim()}" }) { token } }`,
    },
  });

  if (token?.data.errors) return { status: "err_getCareer_0" };
  if (token?.data?.data?.authToken === null)
    return { status: "err_getCareer_1" };

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.data.data.authToken.token}`,
      },
      data: {
        query: `
        query {
          allAccount (careers_Team_Slug: "${team}", profile: A_1){
            edges {
              node {
                firstName
                lastName
                description
                website
                email
                twitter
                linkedin
                github
                picture
                careers {
                  edges {
                    node {
                      team {
                        slug
                        name
                        name${capitalize(locale)}
                      }
                      role {
                        slug
                        name
                        name${capitalize(locale)}
                      }
                      startAt
                      endAt
                    }
                  }
                }
              }
            }
          }
        }
        `,
      },
    });
    if (res?.data?.errors) return { status: "err_getCareer_2" };
    const data = res?.data?.data?.allAccount?.edges;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const result = await getTeamMembers(req.query.team, req.query.locale);

  if (result?.status === "err_getCareer_0") return res.status(500).json([]);
  if (result?.status === "err_getCareer_1") return res.status(500).json([]);
  if (result?.status === "err_getCareer_2") return res.status(500).json([]);
  if (result.errors) return res.status(500).json({ error: result.errors });
  if (result === "err") return res.status(500).json({ error: "err" });

  res.status(200).json(result);
}
