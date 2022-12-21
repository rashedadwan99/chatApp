import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_BASE_API_URL
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    // logger.log(error);
    console.error("An unexpected error occurrred.");
  }
  return Promise.reject(error);
});
axios.defaults.headers.common["x-auth-token"] =
  JSON.parse(localStorage.getItem("user")) &&
  JSON.parse(localStorage.getItem("user")).token;
export const http = {
  post: axios.post,
  get: axios.get,
  delete: axios.delete,
  put: axios.put,
};
