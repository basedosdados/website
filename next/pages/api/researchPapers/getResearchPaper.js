import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getResearchPaper(id) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allResearchpaper (id: "${id}") {
            edges {
              node {
                _id
                title
                authors
                publicationStatus
                year
                volume
                issue
                pages
                doi
                doiUrl
                url
                googleScholar
                abstract
                journal {
                  _id
                  name
                  website
                }
                researchers {
                  edges {
                    node {
                      _id
                      name
                      isInvitedResearcher
                      isInvitedResearcherAlumni
                    }
                  }
                }
              }
            }
          }
        }
        `,
        variables: null
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const result = await getResearchPaper(id);

  if(result.errors) return res.status(500).json({error: result.errors, success: false})
  if(result === "err") return res.status(500).json({error: "err", success: false})

  const node = result?.data?.allResearchpaper?.edges[0]?.node
  if(!node) return res.status(404).json({error: "not found", success: false})

  return res.status(200).json({resource: cleanGraphQLResponse(node), success: true})
}
