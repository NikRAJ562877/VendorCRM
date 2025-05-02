import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box, Grid, TextField, Button, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  useMediaQuery, useTheme
} from "@mui/material";
import apiClient from "../api/auth";

const Orders = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableRows, setEditableRows] = useState({});
  const [defaultDate, setDefaultDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const headers = [
    { key: "DLRCODE", label: "DLR CODE" },
    { key: "DLRNAME", label: "DLRNAME" },
    { key: "Part no.", label: "Part No." },
    { key: "Qty", label: "Qty" },
    { key: "Order no.", label: "Order No./New Order No." },
    { key: "PO", label: "PO" },
    { key: "Location", label: "Location" },
    { key: "Product", label: "Product" },
    { key: "date", label: "Date" },
  ];

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const extractedData = jsonData.map((row) => ({
        DLRCODE: row["DLRCODE"] || "",
        DLRNAME: row["DLRNAME"] || "",
        "Part no.": row["Part no."] || "",
        Qty: row["Qty"] || "",
        "Order no.": row["Order no."] || "",
        PO: row["PO"] || "",
        Location: row["Location"] || "",
        Product: row["Product"] || "",
        date: defaultDate || row["Date"] || "",
      }));

      setOrders(extractedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleEditRow = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleInputChange = (index, key, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][key] = value;
    setOrders(updatedOrders);
  };

  const deleteRow = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const createNewRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      newRow[header.key] = header.key === "date" ? defaultDate || "" : "";
    });
    setOrders((prev) => [...prev, newRow]);
    setEditableRows((prev) => ({ ...prev, [orders.length]: true }));
  };

  const sendToVendor = async () => {
    if (orders.length === 0) {
      alert("No orders to upload.");
      return;
    }

    const formattedOrders = orders.map((order) => ({
      dlrCode: order["DLRCODE"],
      dlrName: order["DLRNAME"],
      partNo: order["Part no."],
      qty: order["Qty"],
      orderNo: order["Order no."],
      po: order["PO"],
      location: order["Location"],
      product: order["Product"],
      date: order["date"] || new Date().toISOString().split("T")[0],
    }));

    try {
      const res = await apiClient({
        endpoint: "/order/upload",
        method: "POST",
        body: { orders: formattedOrders },
      });

      console.log("Response from API:", res);
      alert(`Successfully uploaded ${orders.length} orders to the backend.`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload orders. Please check the server logs and try again.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    headers.some((header) =>
      order[header.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Order Management
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Select Date"
              type="date"
              value={defaultDate}
              onChange={(e) => setDefaultDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="primary" fullWidth onClick={uploadFile}>
              Upload
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="secondary" fullWidth onClick={createNewRow}>
              New Row
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained" color="success" fullWidth onClick={sendToVendor}>
              Send to Vendor
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {orders.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        )}

        {filteredOrders.length > 0 ? (
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell key={header.key}>{header.label}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <TableRow key={index}>
                      {headers.map((header) => (
                        <TableCell key={header.key}>
                          {editableRows[index] ? (
                            <TextField
                              type={header.key === "date" ? "date" : "text"}
                              value={order[header.key]}
                              onChange={(e) =>
                                handleInputChange(index, header.key, e.target.value)
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          ) : (
                            order[header.key] || ""
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => toggleEditRow(index)}
                          sx={{ mb: isMobile ? 1 : 0, mr: 1 }}
                        >
                          {editableRows[index] ? "Save" : "Edit"}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => deleteRow(index)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Typography>No matching results found.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Orders;
