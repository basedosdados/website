import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getAllTeams() {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
          query {
            allCareer {
              edges {
                node {
                  team
                }
              }
            }
          }
        `
      }
    })
    const result = res?.data?.data?.allCareer?.edges
    const teamsSet = new Set()

    result.forEach(item => {
      const team = item.node.team.trim()
      if (team !== "") {
        teamsSet.add(team)
      }
    })

    const data = Array.from(teamsSet)
    return data
  } catch (error) {
    console.error(error)
  }
}
