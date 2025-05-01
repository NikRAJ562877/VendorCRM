import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/auth";  // Import your apiClient
import "../css/VendorFilesView.css";

const VendorFilesView = () => {
  const { vendorId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (vendorId) {
      fetchVendorInvoices();
    }
  }, [vendorId]);

  const fetchVendorInvoices = async () => {
    setError("");
    try {
      const res = await apiClient({
        endpoint: `/admin-invoices/vendor-files/${vendorId}`,
        method: "GET",
      });
      setInvoices(res);
    } catch (err) {
      console.error("Error fetching vendor invoices:", err);
      setError("Failed to load vendor invoices.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-files-view">
      <h2>Files for Vendor ID: {vendorId}</h2>

      {loading ? (
        <p>Loading invoices...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : invoices.length > 0 ? (
        <div className="vendor-files-grid">
          {invoices.map((invoice) => (
            <div className="vendor-files-card" key={invoice._id}>
              <div className="row">
                <span className="label">Invoice No.:</span>
                <span className="value">{invoice.invoiceNo}</span>
              </div>
              <div className="row">
                <span className="label">Date:</span>
                <span className="value">{invoice.date}</span>
              </div>
              <div className="row">
                <span className="label">Month:</span>
                <span className="value">{invoice.month}</span>
              </div>
              <div className="row">
                <span className="label">Amount:</span>
                <span className="value">{invoice.amount}</span>
              </div>
              <div className="row">
                <span className="label">Download:</span>
                <span className="value download-links">
                  {Array.isArray(invoice.fileName) ? (
                    invoice.fileName.map((file, index) => (
                      <div key={index}>
                        <a
                          href={`http://localhost:5000/uploads/${file}`}
                          download
                        >
                          {file}
                        </a>
                      </div>
                    ))
                  ) : (
                    <a
                      href={`http://localhost:5000/uploads/${invoice.fileName}`}
                      download
                    >
                      {invoice.fileName}
                    </a>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No invoices found for this vendor.</p>
      )}
    </div>
  );
};

export default VendorFilesView;
