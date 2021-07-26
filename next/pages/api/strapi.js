import axios from "axios";

export function getStrapiPages() {
  return axios.get("http://strapi:1337/pages/");
}
