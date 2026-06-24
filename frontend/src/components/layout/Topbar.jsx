import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#111111",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important", px: 4 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome back
          </Typography>

          <Typography variant="h6" fontWeight={700}>
            IT Help Desk Dashboard
          </Typography>
        </Box>

        <IconButton onClick={() => navigate("/notifications")}>
          <Badge badgeContent={3} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            ml: 2,
            bgcolor: "#111111",
            color: "#FFFFFF",
            width: 36,
            height: 36,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;