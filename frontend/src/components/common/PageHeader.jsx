import { Box, Typography } from "@mui/material";

function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800} letterSpacing="-0.8px">
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body1" sx={{ color: "#6B7280", mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {action}
    </Box>
  );
}

export default PageHeader;