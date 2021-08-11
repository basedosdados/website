import axios from "axios";

export function getOrganizationList() {
  return axios.get(
    "http://ckan:5000/api/3/action/organization_list?all_fields=true"
  );
}
