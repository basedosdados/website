import axios from "axios";

export function getPages() {
  return axios
    .get("http://django:8000/api/v1/pages/pages/")
    .catch(() => ({ data: [] }));
}

export function getPage(id) {
  if (!id) return null;
  return axios
    .get(`/api/v1/pages/pages/${id}/`)
    .then(({ data }) => data)
    .catch(() => ({}));
}
