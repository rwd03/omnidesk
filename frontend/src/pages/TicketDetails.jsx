import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getTicketById,
  getStatuses,
  assignTicket,
  updateTicketStatus,
  addTicketComment,
  getTicketComments,
  getTicketHistory,
} from "../api/ticketsApi";

import {
  getTicketAttachments,
  uploadTicketAttachment,
  downloadTicketAttachment,
  deleteTicketAttachment,
} from "../api/attachmentsApi";

import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.Role;

  const canManageWorkflow = role === "Admin" || role === "IT Support Agent";
  const canUploadAttachment =
    role === "Admin" || role === "IT Support Agent" || role === "Employee";
  const canDeleteAttachment = role === "Admin" || role === "IT Support Agent";

  const [ticket, setTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [assignedToUserId, setAssignedToUserId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);

  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [uploading, setUploading] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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

  const loadData = async () => {
    try {
      const ticketResponse = await getTicketById(id);
      const statusesResponse = await getStatuses();
      const commentsResponse = await getTicketComments(id);
      const historyResponse = await getTicketHistory(id);
      const attachmentsResponse = await getTicketAttachments(id);

      setTicket(ticketResponse.data);
      setStatuses(statusesResponse.data);
      setComments(commentsResponse.data);
      setHistory(historyResponse.data);
      setAttachments(attachmentsResponse.data);
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Failed to load ticket details.");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAssignTicket = async (e) => {
    e.preventDefault();

    if (!assignedToUserId) {
      setMessageType("warning");
      setMessage("Please enter an agent user ID.");
      return;
    }

    try {
      await assignTicket(id, Number(assignedToUserId));
      setMessageType("success");
      setMessage("Ticket assigned successfully.");
      setAssignedToUserId("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to assign ticket."));
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!statusId) {
      setMessageType("warning");
      setMessage("Please select a status.");
      return;
    }

    try {
      await updateTicketStatus(id, Number(statusId));
      setMessageType("success");
      setMessage("Ticket status updated successfully.");
      setStatusId("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to update status."));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!commentMessage.trim()) {
      setMessageType("warning");
      setMessage("Please enter a comment.");
      return;
    }

    try {
      await addTicketComment(id, commentMessage);
      setMessageType("success");
      setMessage("Comment added successfully.");
      setCommentMessage("");
      await loadData();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to add comment."));
    }
  };

  const handleUploadAttachment = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setMessageType("warning");
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      await uploadTicketAttachment(id, selectedFile);

      setMessageType("success");
      setMessage("Attachment uploaded successfully.");
      setSelectedFile(null);
      setFileInputKey(Date.now());

      await loadData();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to upload attachment."));
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId, fileName) => {
    try {
      const response = await downloadTicketAttachment(attachmentId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName || "attachment";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to download attachment."));
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attachment?"
    );

    if (!confirmed) return;

    try {
      setDeletingAttachmentId(attachmentId);
      await deleteTicketAttachment(attachmentId);

      setMessageType("success");
      setMessage("Attachment deleted successfully.");

      await loadData();
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage(getErrorMessage(error, "Failed to delete attachment."));
    } finally {
      setDeletingAttachmentId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const kb = bytes / 1024;

    if (kb < 1024) {
      return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusChip = (status) => {
    const styles = {
      Open: { bgcolor: "#F3F4F6", color: "#111111" },
      "In Progress": { bgcolor: "#E5E7EB", color: "#111111" },
      Pending: { bgcolor: "#FEF3C7", color: "#92400E" },
      Resolved: { bgcolor: "#DCFCE7", color: "#166534" },
      Closed: { bgcolor: "#111111", color: "#FFFFFF" },
    };

    return (
      <Chip
        label={status || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[status] || { bgcolor: "#F3F4F6", color: "#111111" }),
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const styles = {
      Low: { bgcolor: "#F3F4F6", color: "#111111" },
      Medium: { bgcolor: "#E5E7EB", color: "#111111" },
      High: { bgcolor: "#FFF7ED", color: "#9A3412" },
      Critical: { bgcolor: "#FEE2E2", color: "#991B1B" },
    };

    return (
      <Chip
        label={priority || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[priority] || { bgcolor: "#F3F4F6", color: "#111111" }),
        }}
      />
    );
  };

  if (!ticket) {
    return (
      <AppLayout>
        <Box
          sx={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={34} sx={{ color: "#111111" }} />
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Loading ticket details...
            </Typography>
          </Stack>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Ticket Details"
        subtitle={`Review and manage ticket ${ticket.referenceNumber}.`}
        action={
          <Button
            variant="outlined"
            onClick={() => navigate("/tickets")}
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
            Back to Tickets
          </Button>
        }
      />

      {message && (
        <Alert severity={messageType} sx={{ mb: 3, borderRadius: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
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
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
                    {ticket.referenceNumber}
                  </Typography>

                  <Typography variant="h5" fontWeight={800}>
                    {ticket.title}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {getPriorityChip(ticket.priority)}
                  {getStatusChip(ticket.status)}
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
                Description
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {ticket.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoBlock label="Category" value={ticket.category} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBlock label="Created By" value={ticket.createdBy} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBlock
                    label="Created At"
                    value={
                      ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleString()
                        : "-"
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBlock
                    label="Assigned To"
                    value={ticket.assignedTo || "Not assigned"}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

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
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Attachments
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                Upload screenshots or documents related to this support ticket.
              </Typography>

              {canUploadAttachment && (
                <Box
                  component="form"
                  onSubmit={handleUploadAttachment}
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: 3,
                    p: 2,
                    bgcolor: "#FAFAFA",
                    mb: 3,
                  }}
                >
                  <Stack spacing={2}>
                    <Button
                      component="label"
                      variant="outlined"
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
                      Choose File
                      <input
                        key={fileInputKey}
                        hidden
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </Button>

                    <Typography variant="body2" sx={{ color: "#6B7280" }}>
                      {selectedFile
                        ? `${selectedFile.name} — ${formatFileSize(
                            selectedFile.size
                          )}`
                        : "Allowed files: PNG, JPG, JPEG, PDF, DOC, DOCX, TXT. Maximum size: 10 MB."}
                    </Typography>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={uploading}
                      sx={{
                        bgcolor: "#111111",
                        color: "#FFFFFF",
                        borderRadius: 2,
                        px: 3,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "#2A2A2A",
                        },
                      }}
                    >
                      {uploading ? "Uploading..." : "Upload Attachment"}
                    </Button>
                  </Stack>
                </Box>
              )}

              {attachments.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  No attachments uploaded yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {attachments.map((attachment) => (
                    <Box
                      key={attachment.id}
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        p: 2,
                        bgcolor: "#FAFAFA",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                      >
                        <Box>
                          <Typography fontWeight={800}>
                            {attachment.originalFileName}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ color: "#6B7280", mt: 0.5 }}
                          >
                            {formatFileSize(attachment.fileSize)} • Uploaded by{" "}
                            {attachment.uploadedBy || "-"} •{" "}
                            {attachment.uploadedAt
                              ? new Date(
                                  attachment.uploadedAt
                                ).toLocaleString()
                              : "-"}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleDownloadAttachment(
                                attachment.id,
                                attachment.originalFileName
                              )
                            }
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
                            Download
                          </Button>

                          {canDeleteAttachment && (
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={deletingAttachmentId === attachment.id}
                              onClick={() =>
                                handleDeleteAttachment(attachment.id)
                              }
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
                              {deletingAttachmentId === attachment.id
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Comments
              </Typography>

              <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Write a comment..."
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#111111",
                    color: "#FFFFFF",
                    borderRadius: 2,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "#2A2A2A",
                    },
                  }}
                >
                  Add Comment
                </Button>
              </Box>

              {comments.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  No comments yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{
                        border: "1px solid #E5E7EB",
                        borderRadius: 3,
                        p: 2,
                        bgcolor: "#FAFAFA",
                      }}
                    >
                      <Typography fontWeight={800}>
                        {comment.commentedBy}
                      </Typography>

                      <Typography sx={{ my: 1 }}>{comment.message}</Typography>

                      <Typography variant="caption" sx={{ color: "#6B7280" }}>
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : "-"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          {canManageWorkflow && (
            <>
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
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                    Assign Ticket
                  </Typography>

                  <Box component="form" onSubmit={handleAssignTicket}>
                    <TextField
                      fullWidth
                      type="number"
                      label="IT Support Agent User ID"
                      value={assignedToUserId}
                      onChange={(e) => setAssignedToUserId(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                        },
                      }}
                    />

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#111111",
                        color: "#FFFFFF",
                        borderRadius: 2,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "#2A2A2A",
                        },
                      }}
                    >
                      Assign Ticket
                    </Button>
                  </Box>
                </CardContent>
              </Card>

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
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                    Update Status
                  </Typography>

                  <Box component="form" onSubmit={handleUpdateStatus}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      value={statusId}
                      onChange={(e) => setStatusId(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                        },
                      }}
                    >
                      <MenuItem value="">Select status</MenuItem>
                      {statuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>
                          {status.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: "#111111",
                        color: "#FFFFFF",
                        borderRadius: 2,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "#2A2A2A",
                        },
                      }}
                    >
                      Update Status
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Activity History
              </Typography>

              {history.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  No activity yet.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {history.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        borderLeft: "3px solid #111111",
                        pl: 2,
                      }}
                    >
                      <Typography fontWeight={800}>{item.action}</Typography>

                      <Typography variant="body2" sx={{ color: "#4B5563" }}>
                        {item.description}
                      </Typography>

                      <Typography variant="caption" sx={{ color: "#6B7280" }}>
                        By {item.performedBy} —{" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "-"}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

function InfoBlock({ label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography variant="body2" sx={{ color: "#6B7280", mb: 0.5 }}>
        {label}
      </Typography>

      <Typography fontWeight={700}>{value || "-"}</Typography>
    </Box>
  );
}

export default TicketDetails;