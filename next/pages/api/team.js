import axios from "axios";

export function getBDTeams() {
  return axios
    .get(
      "http://ckan:5000/api/3/action/bd_teams"
    )
    .then(({ data }) => data.result)
}

export function getBDPeople() {
  return axios
    .get(
      "http://ckan:5000/api/3/action/bd_people"
    )
    .then(({ data }) => data.result)
}