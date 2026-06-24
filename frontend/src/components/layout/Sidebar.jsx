import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.Role;

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      badge: "D",
      roles: ["Admin", "IT Support Agent", "Manager", "Employee"],
    },
    {
      label: "Tickets",
      path: "/tickets",
      badge: "T",
      roles: ["Admin", "IT Support Agent", "Manager", "Employee"],
    },
    {
      label: "Create Ticket",
      path: "/tickets/create",
      badge: "+",
      roles: ["Admin", "Employee"],
    },
    {
      label: "Notifications",
      path: "/notifications",
      badge: "N",
      roles: ["Admin", "IT Support Agent", "Manager", "Employee"],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: "#050505",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px">
          OmniDesk
        </Typography>

        <Typography variant="body2" sx={{ color: "#A3A3A3", mt: 0.5 }}>
          IT Help Desk System
        </Typography>

        {user && (
          <Box
            sx={{
              mt: 2,
              border: "1px solid #1F1F1F",
              borderRadius: 2,
              p: 1.5,
              bgcolor: "#0F0F0F",
            }}
          >
            <Typography fontSize={13} fontWeight={800}>
              {user.fullName || user.FullName}
            </Typography>

            <Typography fontSize={12} sx={{ color: "#A3A3A3", mt: 0.3 }}>
              {role}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "#1F1F1F" }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {visibleMenuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: "#D4D4D4",
              display: "flex",
              gap: 1.5,
              "&.active": {
                bgcolor: "#FFFFFF",
                color: "#111111",
              },
              "&:hover": {
                bgcolor: "#1A1A1A",
                color: "#FFFFFF",
              },
              "&.active:hover": {
                bgcolor: "#FFFFFF",
                color: "#111111",
              },
            }}
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: 1.5,
                bgcolor: "rgba(255,255,255,0.12)",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {item.badge}
            </Box>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "#D4D4D4",
            display: "flex",
            gap: 1.5,
            "&:hover": {
              bgcolor: "#1A1A1A",
              color: "#FFFFFF",
            },
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.12)",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            L
          </Box>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default Sidebar;