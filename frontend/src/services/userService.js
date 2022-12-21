import { http } from "./httpService";
const apiEndPoint = "/api/user"
export const signUp = (data) => {
  return http.post(apiEndPoint, data);
};

export const login = (data) => {
  return http.post(`${apiEndPoint}/login`, data);
};

export const searchUser = (searchQuery) => {
  return http.get(`${apiEndPoint}?search=${searchQuery}`);
};
