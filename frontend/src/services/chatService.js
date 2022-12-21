import { http } from "./httpService";
const apiEndPoint = "/chat"
export const handleAccessChat = async (userId) => {
  return http.post(apiEndPoint, { userId });
};

export const getAllChats = () => {
  return http.get(apiEndPoint);
};

export const createGroupChat = (users, name) => {
  return http.post(`${apiEndPoint}/group`, { users, name });
};

export const renameChatGroup = (chatId, name) => {
  return http.put(`${apiEndPoint}/rename`, { chatId, name });
};

export const addUserToGroup = (chatId, userId) => {
  return http.put(`${apiEndPoint}/groupadd`, { chatId, userId });
};

export const removeUserFromGroup = (chatId, userId) => {
  return http.put(`${apiEndPoint}/groupremove`, { chatId, userId });
};
