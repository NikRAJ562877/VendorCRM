import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/auth"; // Import your apiClient
import { CircularProgress, Grid, Card, CardContent, Typography, Button, Box, Alert } from "@mui/material"; // MUI components

const VendorFilesView = () => {
  const { vendorId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (vendorId) {
      fetchVendorInvoices();
    }
  }, [vendorId]);

  const fetchVendorInvoices = async () => {
    setError(""); // Clear any previous errors
    setLoading(true); // Start loading state
    try {
      const res = await apiClient({
        endpoint: `/admin-invoices/vendor-files/${vendorId}`,
        method: "GET",
      });
      setInvoices(res); // Set fetched invoices
    } catch (err) {
      console.error("Error fetching vendor invoices:", err);
      setError("Failed to load vendor invoices.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleDownload = (fileName) => {
    const fileUrl = `http://localhost:5000/uploads/${fileName}`;
    window.open(fileUrl, "_blank"); // Open file in a new tab
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Files for Vendor ID: {vendorId}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert> // MUI Alert for error
      ) : invoices.length > 0 ? (
        <Grid container spacing={3}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} md={4} key={invoice._id}>
              {/* 1 card per row on small screens, 2 per row on medium, and 3 per row on large */}
              <Card sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',  // Ensure card fills its container
                boxShadow: 3,
                borderRadius: 2
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Invoice No.: {invoice.invoiceNo}
                  </Typography>
                  <Typography>Date: {invoice.date}</Typography>
                  <Typography>Month: {invoice.month}</Typography>
                  <Typography>Amount: {invoice.amount}</Typography>

                  <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                      Download:
                    </Typography>
                    {Array.isArray(invoice.fileName) ? (
                      invoice.fileName.map((file, index) => (
                        <Button
                          key={index}
                          onClick={() => handleDownload(file)}
                          variant="contained"
                          color="primary"
                          sx={{ marginTop: 1, width: "100%" }}
                        >
                          {file}
                        </Button>
                      ))
                    ) : (
                      <Button
                        onClick={() => handleDownload(invoice.fileName)}
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 1, width: "100%" }}
                      >
                        {invoice.fileName}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No invoices found for this vendor.
        </Typography>
      )}
    </Box>
  );
};

export default VendorFilesView;
