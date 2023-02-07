import axios from "axios";

export function getBDTeams() {
  return axios
    .get(
      "https://staging.basedosdados.org/api/3/action/bd_teams"
    )
    .then(({ data }) => data.result)
}

export function getBDPeople() {
  return axios
    .get(
      "https://staging.basedosdados.org/api/3/action/bd_people"
    )
    .then(({ data }) => data.result)
}