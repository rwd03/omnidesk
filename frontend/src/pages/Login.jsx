import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import api from "../api/axios";
import AuthLayout from "../components/auth/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage IT support tickets and workflows."
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
            placeholder="Enter your password"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

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
            {submitting ? "Signing in..." : "Login"}
          </Button>

          <Typography variant="body2" sx={{ color: "#6B7280", textAlign: "center" }}>
            No account?{" "}
            <Box
              component={Link}
              to="/register"
              sx={{
                color: "#111111",
                fontWeight: 800,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Register
            </Box>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default Login;