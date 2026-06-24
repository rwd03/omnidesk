import { Box, Card, CardContent, Typography } from "@mui/material";

function KpiCard({ title, value, helper, badge }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 4,
        bgcolor: "#FFFFFF",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#6B7280", fontWeight: 700 }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#111111",
            }}
          >
            {badge}
          </Box>
        </Box>

        <Typography variant="h4" fontWeight={900}>
          {value}
        </Typography>

        <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
          {helper}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default KpiCard;