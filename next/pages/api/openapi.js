import axios from "axios";

export function getOpenApiSchema() {
  return axios
    .get("http://ckan:5000/api/3/action/bd_openapi")
    .then(({ data }) => data.result);
}
