import axios from "axios";
import { axiosInstance } from "../../../axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL

export function getListDatasets() {
  return axios
    .get(`${baseUrl}/v1/public/datasets/`)
    .then(({ data }) => data.results);
}

export function getShowDataset(id) {
  return axios
    .get(`${baseUrl}/v1/public/datasets/${id}`)
    .then(({ data }) => data)
}

export function getOrganization(id) {
  return axios
    .get(id)
    .then(({ data }) => data)
}

export function getInformationRequest(id) {
  return axios
    .get(id)
    .then(({ data }) => data)
}