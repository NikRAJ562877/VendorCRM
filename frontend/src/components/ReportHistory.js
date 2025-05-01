import React, { useEffect, useState } from "react";
import apiClient from "../api/auth"; // centralized API client
import "../css/ReportHistory.css";

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
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch report history");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filtering logic
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

  if (loading) return <p>Loading report history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="report-history-container">
      <h2>Report History</h2>

      {/* Filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />

        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedDate("");
          }}
          className="clear-filters"
        >
          Clear Filters
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="table-wrapper">
        <table className="report-history-table">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Category</th>
              <th>Part No.</th>
              <th>Product Name</th>
              <th>Amount</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Final Total</th>
              <th>Month</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) =>
                report.reports.map((item, index) => (
                  <tr key={`${report._id}-${index}`}>
                    <td>{report.vendorId}</td>
                    <td>{item.category}</td>
                    <td>{item.partNo}</td>
                    <td>{item.productName}</td>
                    <td>{item.amount}</td>
                    <td>{item.qty}</td>
                    <td>{item.total}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={report.reports.length}>{report.finalTotal}</td>
                        <td rowSpan={report.reports.length}>{report.month}</td>
                        <td rowSpan={report.reports.length}>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="10">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportHistory;
