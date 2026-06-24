import { Box, Card, CardContent, Typography } from "@mui/material";

function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "#F7F7F8",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "#050505",
          color: "#FFFFFF",
          p: 6,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={900} letterSpacing="-0.8px">
            OmniDesk
          </Typography>

          <Typography sx={{ color: "#A3A3A3", mt: 1 }}>
            Unified IT Help Desk & Ticket Management Platform
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            fontWeight={900}
            letterSpacing="-1.2px"
            sx={{ maxWidth: 520 }}
          >
            Manage support tickets with clarity and control.
          </Typography>

          <Typography sx={{ color: "#A3A3A3", mt: 2, maxWidth: 500 }}>
            Track requests, assign work, update statuses, and monitor IT
            support activity from one professional dashboard.
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: "#737373" }}>
          © 2026 OmniDesk
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, md: 6 },
        }}
      >
        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 460,
            border: "1px solid #E5E7EB",
            borderRadius: 4,
            bgcolor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={900} letterSpacing="-0.8px">
                {title}
              </Typography>

              <Typography sx={{ color: "#6B7280", mt: 1 }}>
                {subtitle}
              </Typography>
            </Box>

            {children}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AuthLayout;