import axios from "axios";

export function getGroupList() {
  return axios.get("http://ckan:5000/api/3/action/group_list?all_fields=true");
}
