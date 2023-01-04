import axios from "axios";

export function getOrganizationList() {
  return axios.get(
    "https://staging.basedosdados.org/api/3/action/organization_list?all_fields=true"
  );
}
