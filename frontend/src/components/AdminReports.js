import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Collapse,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import apiClient from "../api/auth";

export default function AdminReports() {
  const [reports, setReports] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    (async () => {
      try {
        const data = await apiClient({ endpoint: "/send/admin/reports" });
        setReports(Array.isArray(data) ? data : data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
        setReports([]);
      }
    })();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this report?`)) return;
    const payload = { status: action };
    if (action === "Rejected") {
      const reason = prompt("Enter reason for rejection:");
      if (!reason) return;
      payload.rejectionReason = reason;
    }
    try {
      await apiClient({
        endpoint: `/send/report-status/${id}`,
        method: "PATCH",
        body: payload,
      });
      setReports((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: action, rejectionReason: payload.rejectionReason || "" }
            : r
        )
      );
    } catch (err) {
      console.error(`Error ${action}ing report`, err);
    }
  };

  if (reports === null) {
    return (
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: 8, textAlign: "center" }}
      >
        <Toolbar />
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
        mt: { xs: 6, sm: 8 },
      }}
    >
      <Toolbar />
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
        Submitted Dealer Reports
      </Typography>

      {reports.length === 0 ? (
        <Typography>No reports submitted yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {reports.map((report) => (
            <Grid item xs={12} sm={6} md={4} key={report._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{report.company}</Typography>
                  <Typography>Dealer Code: {report.dealerCode}</Typography>
                  <Typography>Dealer Name: {report.dealerName}</Typography>
                  <Typography>Location: {report.location}</Typography>
                  <Typography>
                    Date: {new Date(report.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>Status: {report.status || "Pending"}</Typography>
                  {report.status === "Rejected" && (
                    <Typography color="error">
                      Reason: {report.rejectionReason}
                    </Typography>
                  )}
                </CardContent>
                <CardActions disableSpacing>
                  <Button
                    size="small"
                    onClick={() => handleAction(report._id, "Accepted")}
                    disabled={report.status === "Accepted"}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleAction(report._id, "Rejected")}
                    disabled={report.status === "Rejected"}
                  >
                    Reject
                  </Button>
                  <IconButton
                    onClick={() =>
                      setExpandedId(expandedId === report._id ? null : report._id)
                    }
                    sx={{
                      marginLeft: "auto",
                      transform:
                        expandedId === report._id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expandedId === report._id} timeout="auto" unmountOnExit>
                  <CardContent>
                    {report.reportData && Object.keys(report.reportData).length > 0 ? (
                      Object.entries(report.reportData).map(([category, sizes]) => (
                        <Box key={category} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2">{category}</Typography>
                          <Typography>
                            S: {sizes.S || 0}, M: {sizes.M || 0}, L: {sizes.L || 0}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No report data available</Typography>
                    )}
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
