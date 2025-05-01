import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiClient from "../api/auth";  // Import your apiClient
import "../css/VendorDashboard.css";

const VendorDashboard = () => {
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user"));
  const vendorId = user?.vendorId;

  const fetchVendorOrders = async () => {
    if (!vendorId) return;

    try {
      setLoading(true);
      const res = await apiClient({
        endpoint: `/vendorOrders/orders/${vendorId}`,
        method: 'GET',
        params: { from_date: fromDate, to_date: toDate },
      });
      setVendorOrders(res);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
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
    doc.text("Vendor Orders", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["DLR CODE", "DLR NAME", "Part No.", "QTY", "Order No.", "PO"]],
      body: vendorOrders.map((order) => [
        order.dlrCode || "N/A",
        order.dlrName || "N/A",
        order.partNo || "N/A",
        order.qty || "N/A",
        order.orderNo || "N/A",
        order.po || "N/A",
      ]),
    });

    doc.save("vendor_orders.pdf");
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(vendorOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VendorOrders");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "vendor_orders.xlsx");
  };

  return (
    <div className="vendor-dashboard">
      <h2>Vendor Orders</h2>

      <div className="date-filters">
        <div className="date-field">
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div className="date-field">
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="download-buttons">
        <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={downloadExcel}>Download Excel</button>
      </div>

      {loading ? (
        <p className="loading">Loading vendor orders...</p>
      ) : vendorOrders.length > 0 ? (
        <div className="table-container">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>DLR CODE</th>
                <th>DLR NAME</th>
                <th>Part No.</th>
                <th>QTY</th>
                <th>Order No.</th>
                <th>PO</th>
              </tr>
            </thead>
            <tbody>
              {vendorOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.dlrCode || "N/A"}</td>
                  <td>{order.dlrName || "N/A"}</td>
                  <td>{order.partNo || "N/A"}</td>
                  <td>{order.qty || "N/A"}</td>
                  <td>{order.orderNo || "N/A"}</td>
                  <td>{order.po || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No orders found for the selected date range.</p>
      )}
    </div>
  );
};

export default VendorDashboard;
