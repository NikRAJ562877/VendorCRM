import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/AdminReports.css";

const AdminReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/send/admin/reports");
        setReports(res.data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };

    fetchReports();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this report?`)) return;

    const payload = { status: action };
    if (action === "Rejected") {
      payload.rejectionReason = prompt("Enter reason for rejection:");
      if (!payload.rejectionReason) return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/send/report-status/${id}`, payload);
      alert(`Report ${action}ed`);
      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: action, rejectionReason: payload.rejectionReason || "" } : r
        )
      );
    } catch (err) {
      console.error(`Error ${action}ing report`, err);
    }
  };

  return (
    <div className="admin-reports-container">
      <h2>Submitted Dealer Reports</h2>
      {reports.length === 0 ? (
        <p>No reports submitted yet.</p>
      ) : (
        <div className="card-grid">
          {reports.map((report) => (
            <div className="report-card" key={report._id}>
              <h3>{report.company}</h3>
              <p><strong>Dealer Code:</strong> {report.dealerCode}</p>
              <p><strong>Dealer Name:</strong> {report.dealerName}</p>
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {report.status || "Pending"}</p>
              {report.status === "Rejected" && (
                <p style={{ color: "red" }}><strong>Reason:</strong> {report.rejectionReason}</p>
              )}
              <details>
                <summary>View Report Data</summary>
                <ul>
                  {report.reportData && Object.keys(report.reportData).length > 0 ? (
                    Object.entries(report.reportData).map(([category, sizes]) => (
                      <li key={category}>
                        <strong>{category}</strong>: {`S: ${sizes.S || 0}, M: ${sizes.M || 0}, L: ${sizes.L || 0}`}
                      </li>
                    ))
                  ) : (
                    <li>No report data available</li>
                  )}
                </ul>
              </details>
              <div className="action-buttons">
                <button
                  className="accept"
                  onClick={() => handleAction(report._id, "Accepted")}
                  disabled={report.status === "Accepted"}
                >
                  Accept
                </button>
                <button
                  className="reject"
                  onClick={() => handleAction(report._id, "Rejected")}
                  disabled={report.status === "Rejected"}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
