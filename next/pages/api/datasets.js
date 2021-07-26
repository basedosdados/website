import { axiosInstance } from "../../axios";

export function getRecentDatasets() {
  return axiosInstance
    .get("/bd_recent_datasets_list?limit=3")
    .then(({ data }) => data.result);
}

export function getPopularDatasets() {
  return axiosInstance
    .get("/bd_popular_datasets_list?limit=3")
    .then(({ data }) => data.result);
}

export function getDatasets({ search = "", sort = "" }) {
  let url = `/package_search?q=${search}`;
  if (search == null) return { count: 0, results: [] };

  if (sort) {
    url += "&sort=" + encodeURI(sort);
  }

  return axiosInstance.get(url).then(({ data }) => data.result);
}
