import axios from "axios";

export async function getTranslations() {
  return axios.get("http://ckan:5000/api/3/action/bd_translation");
}
