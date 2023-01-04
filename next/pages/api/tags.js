import axios from "axios";

export function getTagList() {
  return axios.get("https://staging.basedosdados.org/api/3/action/tag_list?all_fields=true");
}
