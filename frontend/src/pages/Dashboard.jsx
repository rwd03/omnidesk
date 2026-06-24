import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardSummary } from "../api/dashboardApi";

import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

import KpiCard from "../components/dashboard/KpiCard";
import ChartCard from "../components/dashboard/ChartCard";
import EmptyChart from "../components/dashboard/EmptyChart";
import SummaryRow from "../components/dashboard/SummaryRow";

function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const user = useMemo(() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, [storedUser]);

  const role = user?.role || user?.Role;
  const fullName = user?.fullName || user?.FullName;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canCreateTicket = role === "Admin" || role === "Employee";

  useEffect(() => {
    if (!token || !user) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getDashboardSummary();
        setSummary(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, user, navigate]);

  if (!token || !user) {
    return null;
  }

  const getRoleSubtitle = () => {
    if (role === "Admin") {
      return `Welcome back, ${fullName}. You have full system access.`;
    }

    if (role === "IT Support Agent") {
      return `Welcome back, ${fullName}. Manage assigned tickets and support workflow.`;
    }

    if (role === "Manager") {
      return `Welcome back, ${fullName}. Monitor team tickets and support performance.`;
    }

    if (role === "Employee") {
      return `Welcome back, ${fullName}. Track your support requests and ticket updates.`;
    }

    return `Welcome back, ${fullName}.`;
  };

  const getStatusChip = (status) => {
    const styles = {
      Open: { bgcolor: "#F3F4F6", color: "#111111" },
      "In Progress": { bgcolor: "#E5E7EB", color: "#111111" },
      Pending: { bgcolor: "#FEF3C7", color: "#92400E" },
      Resolved: { bgcolor: "#DCFCE7", color: "#166534" },
      Closed: { bgcolor: "#111111", color: "#FFFFFF" },
    };

    return (
      <Chip
        label={status || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[status] || { bgcolor: "#F3F4F6", color: "#111111" }),
        }}
      />
    );
  };

  const getPriorityChip = (priority) => {
    const styles = {
      Low: { bgcolor: "#F3F4F6", color: "#111111" },
      Medium: { bgcolor: "#E5E7EB", color: "#111111" },
      High: { bgcolor: "#FFF7ED", color: "#9A3412" },
      Critical: { bgcolor: "#FEE2E2", color: "#991B1B" },
    };

    return (
      <Chip
        label={priority || "Unknown"}
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          ...(styles[priority] || { bgcolor: "#F3F4F6", color: "#111111" }),
        }}
      />
    );
  };

  const stats = [
    {
      title: "Total Tickets",
      value: summary?.totalTickets ?? 0,
      helper:
        role === "Employee"
          ? "Tickets submitted by you."
          : "Total tickets in the system.",
      badge: "T",
    },
    {
      title: "Open",
      value: summary?.openTickets ?? 0,
      helper: "Tickets waiting for support action.",
      badge: "O",
    },
    {
      title: "In Progress",
      value: summary?.inProgressTickets ?? 0,
      helper: "Tickets currently being handled.",
      badge: "P",
    },
    {
      title: "Pending",
      value: summary?.pendingTickets ?? 0,
      helper: "Tickets waiting for additional information.",
      badge: "N",
    },
    {
      title: "Resolved",
      value: summary?.resolvedTickets ?? 0,
      helper: "Tickets solved by the support workflow.",
      badge: "R",
    },
    {
      title: "Closed",
      value: summary?.closedTickets ?? 0,
      helper: "Tickets completed and closed.",
      badge: "C",
    },
  ];

  const chartColor = "#111111";
  const chartGridColor = "#E5E7EB";

  const hasStatusData = summary?.ticketsByStatus?.length > 0;
  const hasCategoryData = summary?.ticketsByCategory?.length > 0;
  const hasPriorityData = summary?.ticketsByPriority?.length > 0;

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard Analytics"
        subtitle={getRoleSubtitle()}
        action={
          <Stack direction="row" spacing={1.5}>
            {canCreateTicket && (
              <Button
                variant="outlined"
                onClick={() => navigate("/tickets/create")}
                sx={{
                  borderColor: "#D1D5DB",
                  color: "#111111",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#111111",
                    bgcolor: "#F9FAFB",
                  },
                }}
              >
                Create Ticket
              </Button>
            )}

            <Button
              variant="contained"
              onClick={() => navigate("/tickets")}
              sx={{
                bgcolor: "#111111",
                color: "#FFFFFF",
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "#2A2A2A",
                },
              }}
            >
              View Tickets
            </Button>
          </Stack>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={34} sx={{ color: "#111111" }} />

            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              Loading dashboard analytics...
            </Typography>
          </Stack>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} lg={4} key={stat.title}>
                <KpiCard
                  title={stat.title}
                  value={stat.value}
                  helper={stat.helper}
                  badge={stat.badge}
                />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Tickets by Status"
                subtitle="Distribution of tickets across workflow stages."
              >
                {hasStatusData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.ticketsByStatus}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridColor}
                      />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={chartColor}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No status data available yet." />
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Tickets by Category"
                subtitle="Breakdown of support demand by issue category."
              >
                {hasCategoryData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.ticketsByCategory}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartGridColor}
                      />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={chartColor}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No category data available yet." />
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={6}>
              <ChartCard
                title="Tickets by Priority"
                subtitle="Ticket volume grouped by support priority."
              >
                {hasPriorityData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={summary.ticketsByPriority}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {summary.ticketsByPriority.map((entry, index) => (
                          <Cell
                            key={`priority-${entry.name}-${index}`}
                            fill={
                              index % 2 === 0
                                ? "#111111"
                                : index % 3 === 0
                                ? "#6B7280"
                                : "#D1D5DB"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No priority data available yet." />
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12} lg={6}>
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
                    Dashboard Summary
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
                    This section summarizes the current operational status based
                    on live ticket data.
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <SummaryRow
                      label="Active workload"
                      value={
                        (summary?.openTickets ?? 0) +
                        (summary?.inProgressTickets ?? 0) +
                        (summary?.pendingTickets ?? 0)
                      }
                    />

                    <SummaryRow
                      label="Completed tickets"
                      value={
                        (summary?.resolvedTickets ?? 0) +
                        (summary?.closedTickets ?? 0)
                      }
                    />

                    <SummaryRow
                      label="Total dashboard records"
                      value={summary?.totalTickets ?? 0}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Recent Tickets
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                Latest ticket activity shown from the dashboard analytics API.
              </Typography>

              {!summary?.recentTickets || summary.recentTickets.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6B7280" }}>
                  No recent tickets available.
                </Typography>
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>
                          Reference
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>
                          Priority
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>
                          Created By
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>
                          Assigned To
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {summary.recentTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                        >
                          <TableCell>{ticket.referenceNumber}</TableCell>

                          <TableCell sx={{ fontWeight: 700 }}>
                            {ticket.title}
                          </TableCell>

                          <TableCell>
                            {getPriorityChip(ticket.priority)}
                          </TableCell>

                          <TableCell>{getStatusChip(ticket.status)}</TableCell>

                          <TableCell>{ticket.createdBy || "-"}</TableCell>

                          <TableCell>
                            {ticket.assignedTo || "Not assigned"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}

export default Dashboard;