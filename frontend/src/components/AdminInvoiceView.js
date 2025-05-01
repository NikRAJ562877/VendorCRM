import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/auth"; // Adjust path if needed
import "../css/AdminInvoiceView.css";

const AdminInvoiceView = () => {
  const [vendorIds, setVendorIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendorIds();
  }, []);

  const fetchVendorIds = async () => {
    try {
      const invoices = await apiClient({ endpoint: "/admin-invoices" });
      const uniqueVendors = [...new Set(invoices.map((inv) => inv.vendorId))];
      setVendorIds(uniqueVendors);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/vendor-files/${vendorId}`);
  };

  return (
    <div className="admin-invoice-view">
      <h2>Vendor Invoice</h2>
      <div className="vendor-card-container">
        {vendorIds.length > 0 ? (
          vendorIds.map((vendorId) => (
            <div
              key={vendorId}
              className="vendor-card"
              onClick={() => handleVendorClick(vendorId)}
            >
              <p>
                Vendor ID: <strong>{vendorId}</strong>
              </p>
            </div>
          ))
        ) : (
          <p>No vendor invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminInvoiceView;
