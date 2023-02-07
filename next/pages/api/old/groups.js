import axios from "axios";

export function getGroupList() {
  return axios
    .get("https://staging.basedosdados.org/api/3/action/group_list?all_fields=true")
    .then(({ data }) => data.result);
}
