import axios from "axios";

export default function getPeople() {
  return axios
    .get(
      "https://basedosdados.org/api/3/action/bd_people"
    )
    .then(({ data }) => data.result)
}