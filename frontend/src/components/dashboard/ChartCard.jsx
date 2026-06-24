import { Card, CardContent, Typography } from "@mui/material";

function ChartCard({ title, subtitle, children }) {
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
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#6B7280", mt: 1, mb: 3 }}>
          {subtitle}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

export default ChartCard;