import { Box, Typography } from "@mui/material";

function EmptyChart({ message }) {
  return (
    <Box
      sx={{
        height: 300,
        border: "1px dashed #D1D5DB",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography variant="body2" sx={{ color: "#6B7280" }}>
        {message}
      </Typography>
    </Box>
  );
}

export default EmptyChart;