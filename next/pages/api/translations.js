import axios from "axios";

export async function getTranslations() {
  return axios
    .get("https://staging.basedosdados.org/api/3/action/bd_translation")
    .then(({ data }) => data.result)
    .catch(() => []);
}

export async function getAvailableOptionsTranslations() {
  return axios
    .get("https://staging.basedosdados.org/api/3/action/bd_available_options_dict")
    .then(({ data }) => data.result)
    .catch(() => []);
}

export async function getTranslationsOptions() {
  return axios
    .get("https://staging.basedosdados.org/api/3/action/bd_available_options")
    .then(({ data }) => data.result)
    .catch(() => []);
}