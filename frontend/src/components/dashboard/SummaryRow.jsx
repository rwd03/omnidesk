import { Box, Typography } from "@mui/material";

function SummaryRow({ label, value }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography fontWeight={700}>{label}</Typography>

      <Typography variant="h6" fontWeight={900}>
        {value}
      </Typography>
    </Box>
  );
}

export default SummaryRow;