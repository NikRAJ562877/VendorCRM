import React, { useEffect, useState } from "react";
import apiClient from "../api/auth"; // your centralized client
import { Box, Button, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';

const ReportHistory = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiClient({ endpoint: "/reporthistory", method: "GET" });
        const raw = 
          Array.isArray(response) 
            ? response 
            : Array.isArray(response.data) 
              ? response.data 
              : Array.isArray(response.data?.data) 
                ? response.data.data 
                : [];
        console.log("Resolved report array:", raw);
        const sanitized = raw.map((r) => ({
          ...r,
          reports: Array.isArray(r.reports) ? r.reports : [],
        }));
        setReports(sanitized);
        setFilteredReports(sanitized);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch report history");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered
        .map((report) => ({
          ...report,
          reports: report.reports.filter((item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter((report) => report.reports.length > 0);
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (report) =>
          new Date(report.createdAt).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, selectedDate, reports]);

  if (loading) return <Typography>Loading report history...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const validReports = filteredReports.filter((r) => r.reports.length > 0);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Report History
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search by Product Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setSearchTerm("")} size="small">
                  Clear
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Select Date"
          type="date"
          variant="outlined"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setSearchTerm("");
            setSelectedDate("");
          }}
        >
          Clear Filters
        </Button>
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Vendor ID</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Part No.</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Final Total</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {validReports.length > 0 ? (
              validReports.map((report) =>
                report.reports.map((item, idx) => (
                  <TableRow key={`${report._id}-${idx}`}>
                    <TableCell>{report.vendorId}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.partNo}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={report.reports.length}>{report.finalTotal}</TableCell>
                        <TableCell rowSpan={report.reports.length}>{report.month}</TableCell>
                        <TableCell rowSpan={report.reports.length}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">No reports found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportHistory;
