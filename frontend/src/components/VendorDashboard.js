import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Toolbar, 
  Typography, 
  TextField, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper 
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import apiClient from '../api/auth';

const VendorDashboard = () => {
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const user = JSON.parse(sessionStorage.getItem('user'));
  const vendorId = user?.vendorId;

  const fetchVendorOrders = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const res = await apiClient({
        endpoint: `/vendorOrders/orders/${vendorId}`,
        method: 'GET',
        params: { from_date: fromDate, to_date: toDate },
      });
      // If your client puts data on res.data, do: setVendorOrders(res.data)
      setVendorOrders(Array.isArray(res) ? res : res.data ?? []);
    } catch (err) {
      console.error('Error fetching vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchVendorOrders();
    }
  }, [fromDate, toDate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Vendor Orders', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['DLR CODE', 'DLR NAME', 'Part No.', 'QTY', 'Order No.', 'PO']],
      body: vendorOrders.map((o) => [
        o.dlrCode || 'N/A',
        o.dlrName || 'N/A',
        o.partNo || 'N/A',
        o.qty || 'N/A',
        o.orderNo || 'N/A',
        o.po || 'N/A',
      ]),
    });
    doc.save('vendor_orders.pdf');
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendorOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'VendorOrders');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([buf], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
      'vendor_orders.xlsx'
    );
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Vendor Orders
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          onClick={downloadPDF}
          disabled={vendorOrders.length === 0}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          onClick={downloadExcel}
          disabled={vendorOrders.length === 0}
        >
          Download Excel
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading vendor orders...</Typography>
      ) : vendorOrders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['DLR CODE','DLR NAME','Part No.','QTY','Order No.','PO'].map((h) => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorOrders.map((o, idx) => (
                <TableRow key={idx}>
                  <TableCell>{o.dlrCode || 'N/A'}</TableCell>
                  <TableCell>{o.dlrName || 'N/A'}</TableCell>
                  <TableCell>{o.partNo || 'N/A'}</TableCell>
                  <TableCell>{o.qty || 'N/A'}</TableCell>
                  <TableCell>{o.orderNo || 'N/A'}</TableCell>
                  <TableCell>{o.po || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No orders found for the selected date range.</Typography>
      )}
    </Box>
  );
};

export default VendorDashboard;
