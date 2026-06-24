import api from "./axios";

export const getNotifications = () => {
  return api.get("/notifications");
};

export const getUnreadNotificationCount = () => {
  return api.get("/notifications/unread-count");
};

export const markNotificationAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.put("/notifications/mark-all-read");
};

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};