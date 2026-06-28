import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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

import {
  exportReportExcel,
  exportReportPdf,
  getReportSummary,
} from "../api/reportsApi";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";
import ChartCard from "../components/dashboard/ChartCard";
import EmptyChart from "../components/dashboard/EmptyChart";
import KpiCard from "../components/dashboard/KpiCard";

function Reports() {
  const storedUser = localStorage.getItem("user");

  const user = useMemo(() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, [storedUser]);

  const role = user?.role || user?.Role;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState({
    excel: false,
    pdf: false,
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getReportSummary();
        setSummary(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load report summary.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const handleExport = async (type) => {
    const exportKey = type === "excel" ? "excel" : "pdf";

    try {
      setExporting((current) => ({
        ...current,
        [exportKey]: true,
      }));

      if (type === "excel") {
        await exportReportExcel();
      } else {
        await exportReportPdf();
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to export report as ${type.toUpperCase()}.`);
    } finally {
      setExporting((current) => ({
        ...current,
        [exportKey]: false,
      }));
    }
  };

  const stats = [
    {
      title: "Total Tickets",
      value: summary?.totalTickets ?? 0,
      helper:
        role === "Employee"
          ? "Summary of tickets created by you."
          : "Summary of all accessible tickets.",
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
      helper: "Tickets currently being worked on.",
      badge: "P",
    },
    {
      title: "Pending",
      value: summary?.pendingTickets ?? 0,
      helper: "Tickets waiting for more details.",
      badge: "N",
    },
    {
      title: "Resolved",
      value: summary?.resolvedTickets ?? 0,
      helper: "Tickets solved by the support team.",
      badge: "R",
    },
    {
      title: "Closed",
      value: summary?.closedTickets ?? 0,
      helper: "Tickets fully closed out.",
      badge: "C",
    },
  ];

  const hasCategoryData = summary?.ticketsByCategory?.length > 0;
  const hasPriorityData = summary?.ticketsByPriority?.length > 0;
  const hasStatusData = summary?.ticketsByStatus?.length > 0;

  return (
    <AppLayout>
      <PageHeader
        title="Reports"
        subtitle="Review ticket summary metrics and export grouped support statistics."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              disabled={exporting.excel}
              onClick={() => handleExport("excel")}
              sx={outlinedButtonStyles}
            >
              {exporting.excel ? "Exporting..." : "Export Excel"}
            </Button>

            <Button
              variant="contained"
              disabled={exporting.pdf}
              onClick={() => handleExport("pdf")}
              sx={containedButtonStyles}
            >
              {exporting.pdf ? "Exporting..." : "Export PDF"}
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
              Loading reports...
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
                title="Tickets by Category"
                subtitle="Compare ticket demand by support category."
              >
                {hasCategoryData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.ticketsByCategory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#111111"
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
                title="Tickets by Status"
                subtitle="See how tickets are distributed across workflow stages."
              >
                {hasStatusData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={summary.ticketsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#111111"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No status data available yet." />
                )}
              </ChartCard>
            </Grid>

            <Grid item xs={12}>
              <ChartCard
                title="Tickets by Priority"
                subtitle="Review ticket volume by priority level."
              >
                {hasPriorityData ? (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={summary.ticketsByPriority}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                      >
                        {summary.ticketsByPriority.map((entry, index) => (
                          <Cell
                            key={`${entry.name}-${index}`}
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
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={4}>
              <GroupedStatsCard
                title="Category Statistics"
                subtitle="Detailed counts grouped by ticket category."
                rows={summary?.ticketsByCategory || []}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <GroupedStatsCard
                title="Priority Statistics"
                subtitle="Detailed counts grouped by ticket priority."
                rows={summary?.ticketsByPriority || []}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <GroupedStatsCard
                title="Status Statistics"
                subtitle="Detailed counts grouped by ticket status."
                rows={summary?.ticketsByStatus || []}
              />
            </Grid>
          </Grid>
        </>
      )}
    </AppLayout>
  );
}

function GroupedStatsCard({ title, subtitle, rows }) {
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
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>

          <Typography variant="body2" sx={{ color: "#6B7280", mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>

        {rows.length === 0 ? (
          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Typography variant="body2" sx={{ color: "#6B7280" }}>
              No data available.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#F9FAFB",
                    "& th": {
                      fontWeight: 800,
                      color: "#374151",
                      borderBottom: "1px solid #E5E7EB",
                      fontSize: 13,
                    },
                  }}
                >
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={`${title}-${row.name}`}
                    sx={{
                      "& td": {
                        borderBottom: "1px solid #F1F5F9",
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={700} fontSize={14}>
                        {row.name}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={800} fontSize={14}>
                        {row.value}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

const containedButtonStyles = {
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
};

const outlinedButtonStyles = {
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
};

export default Reports;
