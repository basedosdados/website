import axios from "axios";
import { capitalize } from 'lodash';

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export async function getInvitedResearchers(locale = 'pt') {
  const Locale = capitalize(locale)
  const res = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: `
        query {
          allResearcher {
            edges {
              node {
                _id
                slug
                name
                picture
                position
                position${Locale}
                affiliations {
                  edges {
                    node {
                      name
                      name${Locale}
                    }
                  }
                }
                description
                description${Locale}
                email
                website
                linkedin
                googleScholar
                lattes
                isInvitedResearcher
                isInvitedResearcherAlumni
                themes {
                  edges {
                    node {
                      slug
                      name
                      name${Locale}
                    }
                  }
                }
                invitedResearcherTerms {
                  edges {
                    node {
                      cohort
                      startAt
                      endAt
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

  const edges = res?.data?.data?.allResearcher?.edges
  if (!edges) throw new Error(res?.data?.errors?.[0]?.message || "No researchers found")

  return edges
    .map(({ node }) => ({
      id: node._id,
      slug: node.slug,
      name: node.name,
      picture: node.picture || null,
      position: node[`position${Locale}`] || node.position || null,
      affiliations: node.affiliations.edges.map(
        (org) => org.node[`name${Locale}`] || org.node.name
      ),
      description: node[`description${Locale}`] || node.description || null,
      email: node.email || null,
      website: node.website || null,
      linkedin: node.linkedin || null,
      googleScholar: node.googleScholar || null,
      lattes: node.lattes || null,
      isInvitedResearcher: node.isInvitedResearcher,
      isInvitedResearcherAlumni: node.isInvitedResearcherAlumni,
      cohorts: node.invitedResearcherTerms.edges
        .map((term) => term.node.cohort)
        .filter(Boolean)
        .sort(),
      themes: node.themes.edges.map((theme) => ({
        slug: theme.node.slug,
        name: theme.node[`name${Locale}`] || theme.node.name,
      })),
    }))
}

export async function getInvitedResearchersByStatus(locale = 'pt') {
  const researchers = await getInvitedResearchers(locale)
  return {
    current: researchers.filter((researcher) => researcher.isInvitedResearcher),
    alumni: researchers.filter((researcher) => researcher.isInvitedResearcherAlumni),
  }
}

export default async function handler(req, res) {
  const { locale } = req.query;
  try {
    const researchers = await getInvitedResearchersByStatus(locale);
    return res.status(200).json({ resource: researchers, success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
}
