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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { getTickets, deleteTicket } from "../api/ticketsApi";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function TicketList() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.Role;

  const canCreateTicket = role === "Admin" || role === "Employee";
  const canEditTicket = role === "Admin" || role === "IT Support Agent";
  const canDeleteTicket = role === "Admin";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTickets();
      setTickets(response.data);
    } catch (err) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      await deleteTicket(id);
      loadTickets();
    } catch (err) {
      alert("Failed to delete ticket.");
    }
  };

  const getStatusChip = (status) => {
    const styles = {
      Open: {
        bgcolor: "#F3F4F6",
        color: "#111111",
      },
      "In Progress": {
        bgcolor: "#E5E7EB",
        color: "#111111",
      },
      Pending: {
        bgcolor: "#FEF3C7",
        color: "#92400E",
      },
      Resolved: {
        bgcolor: "#DCFCE7",
        color: "#166534",
      },
      Closed: {
        bgcolor: "#111111",
        color: "#FFFFFF",
      },
    };

    return (
      <Chip
        label={status || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[status] || {
            bgcolor: "#F3F4F6",
            color: "#111111",
          }),
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const styles = {
      Low: {
        bgcolor: "#F3F4F6",
        color: "#111111",
      },
      Medium: {
        bgcolor: "#E5E7EB",
        color: "#111111",
      },
      High: {
        bgcolor: "#FFF7ED",
        color: "#9A3412",
      },
      Critical: {
        bgcolor: "#FEE2E2",
        color: "#991B1B",
      },
    };

    return (
      <Chip
        label={priority || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[priority] || {
            bgcolor: "#F3F4F6",
            color: "#111111",
          }),
        }}
      />
    );
  };

  return (
    <AppLayout>
      <PageHeader
        title="Tickets"
        subtitle="Manage, review, and track support tickets."
        action={
          canCreateTicket ? (
            <Button
              variant="contained"
              onClick={() => navigate("/tickets/create")}
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
              }}
            >
              Create Ticket
            </Button>
          ) : null
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Card
        elevation={0}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 4,
          bgcolor: "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <CircularProgress size={32} sx={{ color: "#111111" }} />
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  Loading tickets...
                </Typography>
              </Stack>
            </Box>
          ) : tickets.length === 0 ? (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: 4,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  No tickets found
                </Typography>

                <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
                  {canCreateTicket
                    ? "Create your first support ticket to start tracking requests."
                    : "There are no tickets available to review."}
                </Typography>

                {canCreateTicket && (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/tickets/create")}
                    sx={{
                      mt: 3,
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
                    Create Ticket
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#F9FAFB",
                      "& th": {
                        fontWeight: 800,
                        color: "#374151",
                        borderBottom: "1px solid #E5E7EB",
                        fontSize: 13,
                      },
                    }}
                  >
                    <TableCell>Reference</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      hover
                      sx={{
                        "& td": {
                          borderBottom: "1px solid #F1F5F9",
                          py: 2,
                        },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={800} fontSize={14}>
                          {ticket.referenceNumber}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={700} fontSize={14}>
                          {ticket.title}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={14} sx={{ color: "#4B5563" }}>
                          {ticket.category}
                        </Typography>
                      </TableCell>

                      <TableCell>{getPriorityChip(ticket.priority)}</TableCell>

                      <TableCell>{getStatusChip(ticket.status)}</TableCell>

                      <TableCell>
                        <Typography fontSize={14} sx={{ color: "#4B5563" }}>
                          {ticket.createdBy}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography fontSize={14} sx={{ color: "#4B5563" }}>
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
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
                            View
                          </Button>

                          {canEditTicket && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                navigate(`/tickets/edit/${ticket.id}`)
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
                              Edit
                            </Button>
                          )}

                          {canDeleteTicket && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleDelete(ticket.id)}
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
                              Delete
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

export default TicketList;