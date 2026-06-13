import axios from "axios";

const API_URL = "http://localhost:5081/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTickets = () => {
  return axios.get(`${API_URL}/tickets`, getAuthHeader());
};

export const getTicketById = (id) => {
  return axios.get(`${API_URL}/tickets/${id}`, getAuthHeader());
};

export const createTicket = (ticket) => {
  return axios.post(`${API_URL}/tickets`, ticket, getAuthHeader());
};

export const updateTicket = (id, ticket) => {
  return axios.put(`${API_URL}/tickets/${id}`, ticket, getAuthHeader());
};

export const deleteTicket = (id) => {
  return axios.delete(`${API_URL}/tickets/${id}`, getAuthHeader());
};

export const getCategories = () => {
  return axios.get(`${API_URL}/categories`, getAuthHeader());
};

export const getPriorities = () => {
  return axios.get(`${API_URL}/priorities`, getAuthHeader());
};

export const getStatuses = () => {
  return axios.get(`${API_URL}/statuses`, getAuthHeader());
};

// Week 4 APIs

export const assignTicket = (id, assignedToUserId) => {
  return axios.put(
    `${API_URL}/tickets/${id}/assign`,
    { assignedToUserId },
    getAuthHeader()
  );
};

export const updateTicketStatus = (id, statusId) => {
  return axios.put(
    `${API_URL}/tickets/${id}/status`,
    { statusId },
    getAuthHeader()
  );
};

export const addTicketComment = (id, message) => {
  return axios.post(
    `${API_URL}/tickets/${id}/comments`,
    { message },
    getAuthHeader()
  );
};

export const getTicketComments = (id) => {
  return axios.get(`${API_URL}/tickets/${id}/comments`, getAuthHeader());
};

export const getTicketHistory = (id) => {
  return axios.get(`${API_URL}/tickets/${id}/history`, getAuthHeader());
};