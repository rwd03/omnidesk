import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../api/notificationsApi";

import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function Notifications() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    loadNotifications();
  }, [token, storedUser, navigate]);

  const getErrorMessage = (error, fallback) => {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    return fallback;
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setActionLoadingId(notificationId);
      await markNotificationAsRead(notificationId);

      setMessageType("success");
      setMessage("Notification marked as read.");

      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to mark notification as read."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();

      setMessageType("success");
      setMessage("All notifications marked as read.");

      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to mark all notifications as read."));
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(notificationId);
      await deleteNotification(notificationId);

      setMessageType("success");
      setMessage("Notification deleted successfully.");

      await loadNotifications();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to delete notification."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenTicket = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (error) {
        console.error(error);
      }
    }

    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!token || !storedUser) {
    return null;
  }

  return (
    <AppLayout>
      <PageHeader
        title="Notification Center"
        subtitle="View ticket updates, assignments, comments, and workflow changes."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{
                borderColor: "#D1D5DB",
                color: "#111111",
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "#111111",
                  bgcolor: "#F9FAFB",
                },
              }}
            >
              Back to Dashboard
            </Button>

            <Button
              variant="contained"
              disabled={markingAll || unreadCount === 0}
              onClick={handleMarkAllAsRead}
              sx={{
                bgcolor: "#111111",
                color: "#FFFFFF",
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "#2A2A2A",
                },
                "&.Mui-disabled": {
                  bgcolor: "#D1D5DB",
                  color: "#6B7280",
                },
              }}
            >
              {markingAll ? "Updating..." : "Mark All as Read"}
            </Button>
          </Stack>
        }
      />

      {message && (
        <Alert severity={messageType} sx={{ mb: 3, borderRadius: 3 }}>
          {message}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 4,
          bgcolor: "#FFFFFF",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Notifications Overview
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                Notifications are generated automatically from ticket activity.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Chip
                label={`${notifications.length} Total`}
                sx={{
                  bgcolor: "#F3F4F6",
                  color: "#111111",
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              />

              <Chip
                label={`${unreadCount} Unread`}
                sx={{
                  bgcolor: unreadCount > 0 ? "#111111" : "#F3F4F6",
                  color: unreadCount > 0 ? "#FFFFFF" : "#111111",
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box
          sx={{
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={34} sx={{ color: "#111111" }} />
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Loading notifications...
            </Typography>
          </Stack>
        </Box>
      ) : notifications.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 4,
            bgcolor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={800}>
              No notifications yet
            </Typography>

            <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
              New ticket activity will appear here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              elevation={0}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 4,
                bgcolor: notification.isRead ? "#FFFFFF" : "#FAFAFA",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                  spacing={2}
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="h6" fontWeight={800}>
                        {notification.title}
                      </Typography>

                      {!notification.isRead && (
                        <Chip
                          label="Unread"
                          size="small"
                          sx={{
                            bgcolor: "#111111",
                            color: "#FFFFFF",
                            fontWeight: 800,
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </Stack>

                    <Typography variant="body1" sx={{ color: "#374151" }}>
                      {notification.message}
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 0.5, sm: 2 }}
                      sx={{ mt: 1 }}
                    >
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : "-"}
                      </Typography>

                      {notification.ticketReference && (
                        <Typography variant="body2" sx={{ color: "#6B7280" }}>
                          Ticket: {notification.ticketReference}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  <Divider
                    flexItem
                    orientation="vertical"
                    sx={{ display: { xs: "none", md: "block" } }}
                  />

                  <Stack
                    direction={{ xs: "column", sm: "row", md: "column" }}
                    spacing={1}
                    sx={{ minWidth: { md: 160 } }}
                  >
                    {notification.ticketId && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenTicket(notification)}
                        sx={{
                          bgcolor: "#111111",
                          color: "#FFFFFF",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": {
                            bgcolor: "#2A2A2A",
                          },
                        }}
                      >
                        Open Ticket
                      </Button>
                    )}

                    {!notification.isRead && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={actionLoadingId === notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                        sx={{
                          borderColor: "#D1D5DB",
                          color: "#111111",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": {
                            borderColor: "#111111",
                            bgcolor: "#F9FAFB",
                          },
                        }}
                      >
                        {actionLoadingId === notification.id
                          ? "Updating..."
                          : "Mark Read"}
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      disabled={actionLoadingId === notification.id}
                      onClick={() => handleDeleteNotification(notification.id)}
                      sx={{
                        borderColor: "#FCA5A5",
                        color: "#991B1B",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "#991B1B",
                          bgcolor: "#FEF2F2",
                        },
                      }}
                    >
                      {actionLoadingId === notification.id
                        ? "Working..."
                        : "Delete"}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </AppLayout>
  );
}

export default Notifications;