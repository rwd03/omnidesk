import api from "./axios";

export const suggestTicketCategory = (payload) => {
  return api.post("/ai/categorize", payload);
};

export const suggestTicketPriority = (payload) => {
  return api.post("/ai/priority", payload);
};

export const sendAiChatMessage = (message) => {
  return api.post("/ai/chat", { message });
};
