import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Paper,
  TextField,
  IconButton,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon, Upload as UploadIcon } from "@mui/icons-material";
import apiClient from "../api/auth";

export default function VendorInvoiceUpload() {
  const [invoices, setInvoices] = useState([]);
  const vendorId = JSON.parse(sessionStorage.getItem("user"))?.vendorId || null;

  const addInvoice = () => {
    setInvoices((prev) => [
      ...prev,
      { invoiceNo: "", date: "", month: "", amount: "", file: [] },
    ]);
  };

  const deleteInvoice = (idx) => {
    setInvoices((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, e) => {
    const { name, value, files } = e.target;
    setInvoices((prev) => {
      const copy = [...prev];
      if (name === "file") copy[idx][name] = Array.from(files);
      else copy[idx][name] = value;
      return copy;
    });
  };

  const totalAmount = invoices.reduce(
    (sum, inv) => sum + (parseFloat(inv.amount) || 0),
    0
  );

  const handleSubmit = async () => {
    if (!vendorId) {
      alert("Missing vendor ID. Please log in again.");
      return;
    }

    const formData = new FormData();
    const dataOnly = invoices.map(({ file, ...rest }) => ({
      ...rest,
      vendorId,
    }));
    formData.append("invoices", JSON.stringify(dataOnly));
    invoices.forEach((inv, i) =>
      inv.file.forEach((f) => formData.append(`files-${i}`, f))
    );

    try {
      const res = await apiClient({
        endpoint: "/vendor-invoices/upload",
        method: "POST",
        body: formData,
        token: sessionStorage.getItem("authToken"),
      });
      alert("Invoices uploaded!");
      setInvoices([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Upload Invoices
      </Typography>

      <Stack spacing={2} mb={2}>
        {invoices.map((inv, idx) => (
          <Paper key={idx} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center" flexWrap="wrap">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Invoice No."
                  name="invoiceNo"
                  value={inv.invoiceNo}
                  onChange={(e) => handleChange(idx, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={inv.date}
                  onChange={(e) => handleChange(idx, e)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Month"
                  type="month"
                  name="month"
                  value={inv.month}
                  onChange={(e) => handleChange(idx, e)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Amount"
                  type="number"
                  name="amount"
                  value={inv.amount}
                  onChange={(e) => handleChange(idx, e)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button variant="contained" component="label" fullWidth>
                  Select Files
                  <input
                    type="file"
                    name="file"
                    hidden
                    multiple
                    onChange={(e) => handleChange(idx, e)}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <IconButton
                  color="error"
                  onClick={() => deleteInvoice(idx)}
                  fullWidth
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>

      <Typography variant="subtitle1" gutterBottom>
        Total Amount: {totalAmount.toLocaleString()}
      </Typography>

      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addInvoice}
          fullWidth
          sm={false}
        >
          Add Invoice
        </Button>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={handleSubmit}
          disabled={invoices.length === 0}
          fullWidth
          sm={false}
        >
          Submit Invoices
        </Button>
      </Stack>
    </Box>
  );
}
