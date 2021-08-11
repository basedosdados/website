import axios from "axios";

export function getStrapiPages() {
  return axios.get("http://strapi:1337/pages/");
}

export function getStrapiPage(id) {
  if (!id) return null;
  return axios.get(`/pages/${id}/`).then(({ data }) => data);
}
