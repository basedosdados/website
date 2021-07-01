import axios from "axios";

export const baseUrl = `/api/3/action`;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
});

axiosInstance.interceptors.response.use(undefined, (error) => {
  if (error?.response?.status === 401) {
    setAccessToken(null);
    window.location.reload();
  }

  return Promise.reject(error);
});

export const isLogged = () => {
  return axiosInstance.defaults.headers.common["Authorization"] != null;
};

export const setAccessToken = (token) => {
  if (!token || token === "null")
    return (axiosInstance.defaults.headers.common["Authorization"] = null);
  axiosInstance.defaults.headers.common["Authorization"] = `Token ${token}`;
};
