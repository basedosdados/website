import axios from "axios";

export function getTagList() {
  return axios.get("http://ckan:5000/api/3/action/tag_list?all_fields=true");
}
