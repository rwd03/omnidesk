import api from "./axios";

export const getTicketAttachments = (ticketId) => {
  return api.get(`/ticketattachments/ticket/${ticketId}`);
};

export const uploadTicketAttachment = (ticketId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/ticketattachments/ticket/${ticketId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadTicketAttachment = (attachmentId) => {
  return api.get(`/ticketattachments/${attachmentId}/download`, {
    responseType: "blob",
  });
};

export const deleteTicketAttachment = (attachmentId) => {
  return api.delete(`/ticketattachments/${attachmentId}`);
};