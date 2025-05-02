import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // ← Added import
import apiClient from "../api/auth";

const subcategoryOptions = [
  "Ceramic coating - One year",
  "Ceramic Coating - Two year",
  "Ceramic Coating - Three year",
  "Anti-Microbial treatment",
  "UV Protection",
  "Exterior Beautification",
  "Surface Refinement",
  "Windshield Polishing",
  "Windshield Ceramic",
  "Head Light & Tail Light Polishing",
  "Logo Cleaning",
  "Upholstery",
  "Germ Free",
  "AC Disinfectant",
  "Alloy Wheel Polishing",
  "Alloy Wheel Ceramic",
  "Engine Coating",
];

export default function Send() {
  const [category, setCategory] = useState("");
  const [dealers, setDealers] = useState([]);
  const [pastReports, setPastReports] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const vendorId = user.vendorId;

  useEffect(() => {
    if (!vendorId) return;
    (async () => {
      try {
        const res = await apiClient({
          endpoint: `/send/vendor-reports?vendorId=${vendorId}`,
        });
        setPastReports(Array.isArray(res) ? res : res.data ?? []);
      } catch {
        setPastReports([]);
      }
    })();
  }, [vendorId]);

  const addDealerForm = () => {
    setDealers((d) => [
      ...d,
      {
        id: Date.now(),
        dlrCode: "",
        dlrName: "",
        location: "",
        inputs: {},
        rejectionReason: null,
      },
    ]);
  };

  const removeDealerForm = (i) =>
    setDealers((d) => d.filter((_, idx) => idx !== i));

  const updateDealerField = (i, field, value) =>
    setDealers((d) => {
      const copy = [...d];
      copy[i][field] = value;
      return copy;
    });

  const updateDealerInputs = (i, sub, size, value) =>
    setDealers((d) => {
      const copy = [...d];
      copy[i].inputs = {
        ...copy[i].inputs,
        [sub]: { ...copy[i].inputs[sub], [size]: Math.max(0, value) },
      };
      return copy;
    });

  const fetchDealerDetails = async (i, code) => {
    if (!code) return;
    try {
      const res = await apiClient({
        endpoint: `/send/dealer-details/${code}`,
      });
      const { dlrName, Location, oldRejectedReport } = res;
      setDealers((d) => {
        const copy = [...d];
        copy[i].dlrName = dlrName || "Not found";
        copy[i].location = Location || "Not found";
        if (oldRejectedReport) {
          copy[i].inputs = oldRejectedReport.reportData || {};
          copy[i].rejectionReason = oldRejectedReport.rejectionReason;
        }
        return copy;
      });
    } catch {
      setDealers((d) => {
        const copy = [...d];
        copy[i].dlrName = "Not found";
        copy[i].location = "Not found";
        return copy;
      });
    }
  };

  const handleSubmit = async () => {
    if (!vendorId) {
      alert("Vendor ID not found.");
      return;
    }
    for (const dealer of dealers) {
      if (!dealer.dlrCode || !dealer.dlrName || !dealer.location) {
        alert("Fill all required fields.");
        return;
      }
      try {
        await apiClient({
          endpoint: "/send/submit-report",
          method: "POST",
          body: {
            company: category,
            dealerCode: dealer.dlrCode,
            dealerName: dealer.dlrName,
            location: dealer.location,
            reportData: dealer.inputs,
            vendorId,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
    setCategory("");
    setDealers([]);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Send Reports
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: "100%", maxWidth: 240 }}>
        <InputLabel>Company</InputLabel>
        <Select
          value={category}
          label="Company"
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        >
          <MenuItem value="">
            <em>Select Company</em>
          </MenuItem>
          <MenuItem value="HYUNDAI">HYUNDAI</MenuItem>
          <MenuItem value="VW SKODA">VW SKODA</MenuItem>
        </Select>
      </FormControl>

      {dealers.map((dealer, i) => (
        <Paper key={dealer.id} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center" direction="column" sm={{ direction: "row" }}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dealer Code"
                value={dealer.dlrCode}
                onChange={(e) => {
                  updateDealerField(i, "dlrCode", e.target.value);
                  fetchDealerDetails(i, e.target.value);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dealer Name"
                value={dealer.dlrName}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Location"
                value={dealer.location}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeDealerForm(i)}
                fullWidth
              >
                Remove
              </Button>
            </Grid>

            {dealer.rejectionReason && (
              <Grid item xs={12}>
                <Typography color="error">
                  Rejected: {dealer.rejectionReason}
                </Typography>
              </Grid>
            )}

            {subcategoryOptions.map((sub) => (
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                key={sub}
                component={Paper}
                variant="outlined"
                sx={{ p: 2, minHeight: 120 }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {sub}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {["S", "M", "L"].map((size) => (
                    <TextField
                      key={size}
                      label={size}
                      type="number"
                      value={dealer.inputs?.[sub]?.[size] ?? ""}
                      onChange={(e) =>
                        updateDealerInputs(
                          i,
                          sub,
                          size,
                          parseInt(e.target.value, 10)
                        )
                      }
                      sx={{ width: 60 }}
                    />
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      <Stack direction="row" spacing={2} mb={4} justifyContent="space-between" flexWrap="wrap">
        <Button variant="outlined" onClick={addDealerForm} startIcon={<AddIcon />}>
          Add Dealer
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit Report
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Submitted Reports
      </Typography>
      {pastReports.length === 0 ? (
        <Typography>No reports submitted yet.</Typography>
      ) : (
        pastReports.map((rpt, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">
              {rpt.dealerName} ({rpt.dealerCode})
            </Typography>
            <Typography>Location: {rpt.location}</Typography>
            <Typography>Status: {rpt.status}</Typography>
            {rpt.status === "Rejected" && (
              <Typography color="error">
                Reason: {rpt.rejectionReason}
              </Typography>
            )}
            <Box mt={1}>
              {Object.entries(rpt.reportData || {}).map(([sub, sizes]) => (
                <Box key={sub} sx={{ mb: 1 }}>
                  <Typography fontWeight="bold">{sub}</Typography>
                  <Stack direction="row" spacing={2}>
                    {Object.entries(sizes).map(([sz, qty]) => (
                      <Typography key={sz}>
                        {sz}: {qty}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}
