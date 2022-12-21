import { http } from "./httpService";

const apiEndPoint = "/message"
export const sendMessageHandler = (content, chatId) => {
  return http.post(apiEndPoint, { chatId, content });
};

export const getAllMessages = (chatId) => {
  return http.get(`${apiEndPoint}/${chatId}`);
};
