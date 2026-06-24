import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { createTicket, getCategories, getPriorities } from "../api/ticketsApi";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function CreateTicket() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.Role;

  const canCreateTicket = role === "Admin" || role === "Employee";

  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    priorityId: "",
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!canCreateTicket) return;

    const loadDropdowns = async () => {
      try {
        const categoriesResponse = await getCategories();
        const prioritiesResponse = await getPriorities();

        setCategories(categoriesResponse.data);
        setPriorities(prioritiesResponse.data);
      } catch (err) {
        setError("Failed to load categories or priorities.");
      }
    };

    loadDropdowns();
  }, [canCreateTicket]);

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
      await createTicket({
        title: form.title,
        description: form.description,
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
      });

      navigate("/tickets");
    } catch (err) {
      setError("Failed to create ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!canCreateTicket) {
    return (
      <AppLayout>
        <PageHeader
          title="Access Denied"
          subtitle="You do not have permission to create support tickets."
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
              Only Admin and Employee users can create tickets. Your current
              role is {role || "unknown"}.
            </Typography>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Create Ticket"
        subtitle="Submit a new IT support request with category and priority details."
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
                Provide a clear title and detailed description so the support
                team can understand the issue quickly.
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
                    placeholder="Example: Cannot access company email"
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
                    placeholder="Describe the issue, when it started, and any error messages you see."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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

                    <Grid item xs={12} md={6}>
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
                      {submitting ? "Creating..." : "Create Ticket"}
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
                Submission Guidelines
              </Typography>

              <Stack spacing={2}>
                <GuidelineItem
                  number="01"
                  title="Use a specific title"
                  description="Avoid vague titles such as 'Help' or 'Problem'."
                />

                <GuidelineItem
                  number="02"
                  title="Describe the context"
                  description="Mention the system, device, or service affected."
                />

                <GuidelineItem
                  number="03"
                  title="Choose the right priority"
                  description="Use Critical only for urgent business-impacting issues."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

function GuidelineItem({ number, title, description }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          color: "#6B7280",
          letterSpacing: "0.08em",
        }}
      >
        {number}
      </Typography>

      <Typography fontWeight={800} sx={{ mt: 0.5 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
}

export default CreateTicket;