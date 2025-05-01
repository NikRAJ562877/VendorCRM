import React, { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import Select from "react-select";
import apiClient from "../api/auth"; // centralized apiClient

const productOptions = [
  { value: "Ceramic Coating", label: "Ceramic Coating" },
  { value: "Ultra Premium PPF", label: "Ultra Premium PPF" },
];

export default function DlrMappingScreen() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [productCategory, setProductCategory] = useState(null);
  const [dlrCodeOptions, setDlrCodeOptions] = useState([]);
  const [selectedDlrCodes, setSelectedDlrCodes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [mappings, setMappings] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchVendors();
    fetchMappings();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await apiClient({ endpoint: "/dlr/vendors" });
      setVendors(res.map(v => ({ value: v.vendorId, label: v.vendorId })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDlrCodes = async (product) => {
    try {
      const res = await apiClient({
        endpoint: `/dlr/unmapped-dlr-codes?product=${encodeURIComponent(product)}`
      });
      setDlrCodeOptions(res.map(code => ({ value: code, label: code })));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMappings = async () => {
    try {
      const res = await apiClient({ endpoint: "/dlr/mapping" });
      setMappings(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVendor || !productCategory || selectedDlrCodes.length === 0) {
      alert("Vendor, product, and at least one DLR code are required.");
      return;
    }

    const payload = {
      vendorId: selectedVendor.value,
      dlrCodes: selectedDlrCodes.map(d => d.value),
      date: selectedDate,
    };

    try {
      if (editId) {
        await apiClient({
          endpoint: `/dlr/mappings/${editId}`,
          method: "PUT",
          body: payload,
        });
        alert("Mapping updated!");
      } else {
        await apiClient({
          endpoint: "/dlr/map",
          method: "POST",
          body: payload,
        });
        alert("Mapping added!");
      }
      setEditId(null);
      setSelectedDlrCodes([]);
      setSelectedVendor(null);
      setProductCategory(null);
      setSelectedDate("");
      fetchMappings();
      if (productCategory) fetchDlrCodes(productCategory.value);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleEdit = m => {
    setEditId(m._id);
    setSelectedVendor({ value: m.vendorId, label: m.vendorId });
    setSelectedDate(m.date || "");
    setSelectedDlrCodes(m.dlrCodes.map(code => ({ value: code, label: code })));
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        DLR Code to Vendor Mapping
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography>Select Vendor</Typography>
            <Select
              options={vendors}
              value={selectedVendor}
              onChange={setSelectedVendor}
              placeholder="Search & select"
              menuPortalTarget={document.body} // Attach menu to body
              styles={{
                menuPortal: base => ({
                  ...base,
                  zIndex: 9999, // Ensure dropdown appears above all content
                }),
                menu: base => ({
                  ...base,
                  position: 'absolute', // Ensure it's positioned properly
                  top: 'auto', // Let the menu position dynamically
                  bottom: '100%', // Position above the input
                  transform: 'translateY(-8px)', // Fine-tune dropdown position
                }),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography>Select Product Category</Typography>
            <Select
              options={productOptions}
              value={productCategory}
              onChange={opt => {
                setProductCategory(opt);
                fetchDlrCodes(opt.value);
              }}
              placeholder="Select product"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: base => ({
                  ...base,
                  position: 'absolute',
                  top: 'auto',
                  bottom: '100%',
                  transform: 'translateY(-8px)',
                }),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography>Select DLR Codes</Typography>
            <Select
              options={dlrCodeOptions}
              value={selectedDlrCodes}
              onChange={setSelectedDlrCodes}
              isMulti
              placeholder="Choose codes"
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: base => ({
                  ...base,
                  position: 'absolute',
                  top: 'auto',
                  bottom: '100%',
                  transform: 'translateY(-8px)',
                }),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography>Select Date</Typography>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              {editId ? "Update Mapping" : "Map DLR Code"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Existing Mappings
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table style={{ width: "100%", borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              <TableCell>Vendor ID</TableCell>
              <TableCell>DLR Codes</TableCell>
              <TableCell>Mapped Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappings.map(m => (
              <TableRow key={m._id}>
                <TableCell>{m.vendorId}</TableCell>
                <TableCell>{m.dlrCodes.join(", ")}</TableCell>
                <TableCell>{m.date || "Not Set"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleEdit(m)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
