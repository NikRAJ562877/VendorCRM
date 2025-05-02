import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "../api/auth";

export default function VendorReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is mobile

  const fetchReports = async () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const vendorId = user?.vendorId;
      const token = sessionStorage.getItem("authToken");
      const response = await apiClient({
        endpoint: `/reports/getReportByVendor?vendorId=${vendorId}&month=${selectedMonth}`,
        method: "GET",
        token,
      });
      setReports(Array.isArray(response) ? response : response.data ?? []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (reports.length === 0) {
      alert("No reports available to download.");
      return;
    }
    const doc = new jsPDF();
    doc.text(`Vendor Reports - ${months[selectedMonth - 1]}`, 14, 10);
    const headers = [
      "Vendor ID",
      "Category",
      "Part No",
      "Product Name",
      "Qty",
      "Amount",
      "Total",
    ];
    const rows = [];
    let finalTotal = 0;
    reports.forEach((rep) => {
      rep.reports.forEach((r) => {
        rows.push([
          rep.vendorId,
          r.category,
          r.partNo,
          r.productName,
          r.qty,
          r.amount,
          r.total,
        ]);
      });
      finalTotal += rep.finalTotal;
    });
    autoTable(doc, { head: [headers], body: rows, startY: 20 });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Final Amount: ₹${finalTotal}`, 14, finalY);
    doc.save(`vendor_reports_${selectedMonth}.pdf`);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Vendor Reports
      </Typography>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        alignItems="center"
        mb={3}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel id="month-label">Month</InputLabel>
          <Select
            labelId="month-label"
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <MenuItem value="">
              <em>Select Month</em>
            </MenuItem>
            {months.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={fetchReports} fullWidth={isMobile}>
          Search
        </Button>
        {reports.length > 0 && (
          <Button variant="outlined" onClick={downloadPDF} fullWidth={isMobile}>
            Download PDF
          </Button>
        )}
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : reports.length === 0 ? (
        <Typography>
          {selectedMonth
            ? `No reports found for ${months[selectedMonth - 1]}.`
            : "Please select a month and click Search."}
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {["Vendor ID", "Category", "Part No", "Product Name", "Qty", "Amount", "Total", "Final Total"].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((rep, idx) =>
                rep.reports.map((r, j) => (
                  <TableRow key={`${idx}-${j}`}>
                    {j === 0 && (
                      <TableCell rowSpan={rep.reports.length}>
                        {rep.vendorId}
                      </TableCell>
                    )}
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.partNo}</TableCell>
                    <TableCell>{r.productName}</TableCell>
                    <TableCell>{r.qty}</TableCell>
                    <TableCell>{r.amount}</TableCell>
                    <TableCell>{r.total}</TableCell>
                    {j === 0 && (
                      <TableCell rowSpan={rep.reports.length}>
                        ₹{rep.finalTotal}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
