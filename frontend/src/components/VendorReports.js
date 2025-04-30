import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const VendorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(""); // Stores selected month
  const [months] = useState([
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]);

  // ✅ Fetch reports based on vendorId & selected month
  const fetchReports = async () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }

    try {
      setLoading(true);
      console.log("🟢 Fetching reports for month:", selectedMonth);
      
      const user = JSON.parse(sessionStorage.getItem("user"));
      const vendorId = user?.vendorId;

      const response = await fetch(`http://localhost:5000/api/reports/getReportByVendor?vendorId=${vendorId}&month=${selectedMonth}`);

      if (!response.ok) {
        throw new Error(`❌ HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🟢 Fetched Reports Data:", data);
      setReports(data);
    } catch (error) {
      console.error("❌ Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate PDF
  const downloadPDF = () => {
    if (reports.length === 0) {
      alert("No reports available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Labour Reports - ${selectedMonth}`, 14, 10);

    const tableColumn = [
      "Vendor ID",
      "Category",
      "Part No",
      "Product Name",
      "Qty",
      "Amount",
      "Total",
    ];
    const tableRows = [];

    let finalTotalAmount = 0; // To store the final total

    reports.forEach((report) => {
      report.reports.forEach((r) => {
        const row = [
          report.vendorId,
          r.category,
          r.partNo,
          r.productName,
          r.qty,
          r.amount,
          r.total,
        ];
        tableRows.push(row);
      });

      // Accumulate finalTotal for all reports
      finalTotalAmount += report.finalTotal;
    });

    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Add Final Amount below the table
    const finalY = doc.lastAutoTable.finalY + 10; // Position after the table
    const pageWidth = doc.internal.pageSize.width;
    doc.text(`Final Amount: ₹${finalTotalAmount} + GST`, pageWidth - 80, finalY);

    doc.save(`vendor_reports_${selectedMonth}.pdf`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Vendor Reports</h2>

      {/* Month Selection */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Select Month</option>
          {months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </select>

        <button
          onClick={fetchReports}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          🔍 Search
        </button>
      </div>

      {/* Show Download PDF only if data is available */}
      {reports.length > 0 && (
        <button
          onClick={downloadPDF}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-red-700"
        >
          📄 Download PDF
        </button>
      )}

      {/* Display Reports */}
      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No reports found for {selectedMonth ? months[selectedMonth - 1] : "selected month"}.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Category</th>
                <th className="border p-3">Part No</th>
                <th className="border p-3">Product Name</th>
                <th className="border p-3">Qty</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Total</th>
                <th className="border p-3">Final Total</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="border">
                  <td className="border p-3">{report.reports.map((r) => r.category).join(", ")}</td>
                  <td className="border p-3">{report.reports.map((r) => r.partNo).join(", ")}</td>
                  <td className="border p-3">{report.reports.map((r) => r.productName).join(", ")}</td>
                  <td className="border p-3">{report.reports.map((r) => r.qty).join(", ")}</td>
                  <td className="border p-3">{report.reports.map((r) => r.amount).join(", ")}</td>
                  <td className="border p-3">{report.reports.map((r) => r.total).join(", ")}</td>
                  <td className="border p-3 font-bold">₹{report.finalTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorReports;
