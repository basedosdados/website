import { axiosInstance } from "../../axios";

export function getRecentDatasets() {
  return axiosInstance
    .get("/bd_list_recent_datasets?limit=3")
    .then(({ data }) => data.result);
}

export function getPopularDatasets() {
  return axiosInstance
    .get("/bd_list_popular_datasets?limit=3")
    .then(({ data }) => data.result);
}
