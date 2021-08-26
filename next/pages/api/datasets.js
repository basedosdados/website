import axios from "axios";
import { axiosInstance } from "../../axios";

export function getRecentDatasets() {
  return axiosInstance
    .get("/bd_recent_datasets_list?limit=10")
    .then(({ data }) => data.result);
}

export function getPopularDatasets() {
  return axiosInstance
    .get("/bd_popular_datasets_list?limit=10")
    .then(({ data }) => data.result);
}

export function listDatasets() {
  return axios
    .get(`http://ckan:5000/api/3/action/package_list`)
    .then(({ data }) => data.result);
}

export function showDataset(id) {
  return axios
    .get(`http://ckan:5000/api/3/action/package_show?id=${id}`)
    .then(({ data }) => data.result);
}

export function searchDatasets({ search = "", sort = "", paramFilters = {} }) {
  let url = `/bd_dataset_search?q=${search}`;
  let entries = Object.entries(paramFilters);

  if (search == null) return { count: 0, results: [] };

  if (sort) {
    url += "&order_by=" + encodeURI(sort);
  }

  if (entries.length > 0) {
    Object.entries(paramFilters).forEach(([k, v]) => {
      if (v.length == 0 || !v) return;

      url += `&${k}=${v.join(",")} `;
    });
  }

  return axiosInstance.get(url).then(({ data }) => data.result);
}
