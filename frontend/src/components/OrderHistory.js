import React, { useEffect, useState } from "react";
import apiClient from "../api/auth"; // ✅ Use your centralized API client
import { Box, Grid, TextField, Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
 
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dealerName, setDealerName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient({
          endpoint: "/orderhistory",
          method: "GET",
        });
        setOrders(response);
        setFilteredOrders(response);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (dealerName) {
      filtered = filtered.filter((order) =>
        order.dlrName.toLowerCase().includes(dealerName.toLowerCase())
      );
    }

    if (partNo) {
      filtered = filtered.filter((order) =>
        order.partNo.toLowerCase().includes(partNo.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.date).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredOrders(filtered);
  }, [dealerName, partNo, selectedDate, orders]);

  const handleClearFilters = () => {
    setDealerName("");
    setPartNo("");
    setSelectedDate("");
    setFilteredOrders(orders); // Reset to show all orders
  };

  if (loading) return <Typography>Loading order history...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Order History
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by Dealer Name"
              value={dealerName}
              onChange={(e) => setDealerName(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by Part No."
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order No.</TableCell>
                <TableCell>Dealer Code</TableCell>
                <TableCell>Dealer Name</TableCell>
                <TableCell>Part No.</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>PO</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNo}</TableCell>
                    <TableCell>{order.dlrCode}</TableCell>
                    <TableCell>{order.dlrName}</TableCell>
                    <TableCell>{order.partNo}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell>{order.po}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderHistory;
