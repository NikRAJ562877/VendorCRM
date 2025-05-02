import React, { useState, useEffect } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiClient from "../api/auth";

export default function VendorOrders() {
  const [vendorOrders, setVendorOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is mobile

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.role === "vendor") {
      (async () => {
        try {
          const res = await apiClient({
            endpoint: `/vendorOrders/${user.vendorId}`,
            method: "GET",
            token: sessionStorage.getItem("authToken"),
          });
          // If your client returns data on res.data, adjust accordingly:
          setVendorOrders(res.orders ?? res.data?.orders ?? []);
        } catch (err) {
          console.error("Error fetching vendor orders:", err);
          setVendorOrders([]);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setVendorOrders([]);
      setLoading(false);
    }
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Vendor Orders", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["DLR CODE", "ZONE", "BO DLR NO.", "Part no.", "Order no.", "PO"]],
      body: (vendorOrders || []).map((o) => [
        o["DLR CODE"] || "N/A",
        o["ZONE"] || "N/A",
        o["BO DLR NO."] || "N/A",
        o["Part no."] || "N/A",
        o["Order no."] || "N/A",
        o["PO"] || "N/A",
      ]),
    });
    doc.save("vendor_orders.pdf");
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendorOrders || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorOrders");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "vendor_orders.xlsx"
    );
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Toolbar />
      <Typography variant="h5" gutterBottom>
        Vendor Orders
      </Typography>

      {(loading ? (
        <Typography>Loading vendor orders…</Typography>
      ) : (vendorOrders || []).length > 0 ? (
        <>
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={2}
            mb={2}
            alignItems="flex-start"
          >
            <Button variant="contained" onClick={downloadPDF}>
              Download PDF
            </Button>
            <Button variant="contained" onClick={downloadExcel}>
              Download Excel
            </Button>
          </Stack>

          <TableContainer
            component={Paper}
            sx={{ maxWidth: "100%", overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "DLR CODE",
                    "ZONE",
                    "BO DLR NO.",
                    "Part no.",
                    "Order no.",
                    "PO",
                  ].map((h) => (
                    <TableCell key={h}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorOrders.map((o, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{o["DLR CODE"] || "N/A"}</TableCell>
                    <TableCell>{o["ZONE"] || "N/A"}</TableCell>
                    <TableCell>{o["BO DLR NO."] || "N/A"}</TableCell>
                    <TableCell>{o["Part no."] || "N/A"}</TableCell>
                    <TableCell>{o["Order no."] || "N/A"}</TableCell>
                    <TableCell>{o["PO"] || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography>No orders found for your vendor ID.</Typography>
      ))}
    </Box>
  );
}
