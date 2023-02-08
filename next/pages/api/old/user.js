import { axiosInstance } from "../../../axios";

export function getUser() {
  return axiosInstance
    .get("/bd_get_current_user?timestamp" + new Date().getTime()) // adding timestamp to force no-cache
    .then(({ data }) => data.result);
}
