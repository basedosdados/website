import axios from "axios";

export default function getTeams() {
  return axios
    .get(
      "https://basedosdados.org/api/3/action/bd_teams"
    )
    .then(({ data }) => data.result)
}