import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import api from "../api/axios";
import AuthLayout from "../components/auth/AuthLayout";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: 2,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "roleId" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/auth/register", {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        roleId: Number(form.roleId),
      });

      navigate("/");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register a new OmniDesk user account and assign the correct role."
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Role"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          >
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>Employee</MenuItem>
            <MenuItem value={3}>IT Support Agent</MenuItem>
            <MenuItem value={4}>Manager</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: "#111111",
              color: "#FFFFFF",
              borderRadius: 2,
              py: 1.3,
              textTransform: "none",
              fontWeight: 800,
              "&:hover": {
                bgcolor: "#2A2A2A",
              },
            }}
          >
            {submitting ? "Creating account..." : "Register"}
          </Button>

          <Typography
            variant="body2"
            sx={{ color: "#6B7280", textAlign: "center" }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/"
              sx={{
                color: "#111111",
                fontWeight: 800,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Login
            </Box>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Register;