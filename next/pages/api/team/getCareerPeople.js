import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function getCareerPeople(team) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allAccount (career_Team: "${team}"){
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
                careerSet {
                  edges {
                    node {
                      _id
                      team
                      role
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
    const data = res?.data?.data?.allAccount?.edges
    return data
  } catch (error) {
    console.error(error)
  }
}
