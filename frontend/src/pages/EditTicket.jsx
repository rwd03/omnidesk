import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  getTicketById,
  updateTicket,
  getCategories,
  getPriorities,
  getStatuses,
} from "../api/ticketsApi";

import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.Role;

  const canEditTicket = role === "Admin" || role === "IT Support Agent";

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
    statusId: "",
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!canEditTicket) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const ticketResponse = await getTicketById(id);
        const categoriesResponse = await getCategories();
        const prioritiesResponse = await getPriorities();
        const statusesResponse = await getStatuses();

        const ticket = ticketResponse.data;
        const categoriesData = categoriesResponse.data;
        const prioritiesData = prioritiesResponse.data;
        const statusesData = statusesResponse.data;

        setCategories(categoriesData);
        setPriorities(prioritiesData);
        setStatuses(statusesData);

        const selectedCategory = categoriesData.find(
          (c) => c.name === ticket.category
        );

        const selectedPriority = prioritiesData.find(
          (p) => p.name === ticket.priority
        );

        const selectedStatus = statusesData.find(
          (s) => s.name === ticket.status
        );

        setForm({
          title: ticket.title || "",
          description: ticket.description || "",
          categoryId: selectedCategory ? selectedCategory.id : "",
          priorityId: selectedPriority ? selectedPriority.id : "",
          statusId: selectedStatus ? selectedStatus.id : "",
        });
      } catch (err) {
        setError("Failed to load ticket data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, canEditTicket]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await updateTicket(id, {
        title: form.title,
        description: form.description,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        statusId: Number(form.statusId),
      });

      navigate("/tickets");
    } catch (err) {
      setError("Failed to update ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canEditTicket) {
    return (
      <AppLayout>
        <PageHeader
          title="Access Denied"
          subtitle="You do not have permission to edit tickets."
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

        <Card
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 4,
            bgcolor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={800}>
              Restricted Page
            </Typography>

            <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
              Only Admin and IT Support Agent users can edit and manage tickets.
              Your current role is {role || "unknown"}.
            </Typography>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  if (loading) {
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
              Loading ticket data...
            </Typography>
          </Stack>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Edit Ticket"
        subtitle="Update ticket information, priority, category, and status."
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

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Ticket Information
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                Modify the ticket details below and save the updated record.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    required
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={5}
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        required
                        select
                        label="Category"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        <MenuItem value="">Select category</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        required
                        select
                        label="Priority"
                        name="priorityId"
                        value={form.priorityId}
                        onChange={handleChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        <MenuItem value="">Select priority</MenuItem>
                        {priorities.map((priority) => (
                          <MenuItem key={priority.id} value={priority.id}>
                            {priority.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        required
                        select
                        label="Status"
                        name="statusId"
                        value={form.statusId}
                        onChange={handleChange}
                        sx={{
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
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      sx={{
                        bgcolor: "#111111",
                        color: "#FFFFFF",
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          bgcolor: "#2A2A2A",
                        },
                      }}
                    >
                      {submitting ? "Updating..." : "Update Ticket"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => navigate("/tickets")}
                      sx={{
                        borderColor: "#D1D5DB",
                        color: "#111111",
                        borderRadius: 2,
                        px: 4,
                        py: 1.2,
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                          borderColor: "#111111",
                          bgcolor: "#F9FAFB",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
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
                Edit Notes
              </Typography>

              <Stack spacing={2}>
                <InfoBox
                  title="Status updates"
                  description="Changing the status will affect ticket workflow tracking."
                />

                <InfoBox
                  title="Priority updates"
                  description="Use High or Critical only when the issue has strong business impact."
                />

                <InfoBox
                  title="Audit consistency"
                  description="Major workflow changes should also be visible in the activity history."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

function InfoBox({ title, description }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography fontWeight={800}>{title}</Typography>

      <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
}

export default EditTicket;