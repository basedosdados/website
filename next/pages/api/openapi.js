import axios from "axios";

export function getOpenApiSchema() {
  return axios
    .get("https://staging.basedosdados.org/api/3/action/bd_openapi")
    .then(({ data }) => data.result);
}
