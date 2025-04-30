import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/VendorOrders.css";

const VendorOrders = () => {
  const [vendorOrders, setVendorOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve vendor info from sessionStorage (set during login)
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.role === "vendor") {
      const fetchVendorOrders = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/vendorOrders/${user.vendorId}`);
          setVendorOrders(res.data);
        } catch (err) {
          console.error("Error fetching vendor orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVendorOrders();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="loading-text">Loading vendor orders...</div>;

  return (
    <div className="vendor-orders-container">
      <h2>Vendor Orders</h2>
      
      {vendorOrders ? (
        vendorOrders.orders && vendorOrders.orders.length > 0 ? (
          <>
            <div className="button-group">
              <button className="button">Download PDF</button>
              <button className="button">Download Excel</button>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>DLR CODE</th>
                  <th>ZONE</th>
                  <th>BO DLR NO.</th>
                  <th>Part no.</th>
                  <th>Order no.</th>
                  <th>PO</th>
                </tr>
              </thead>
              <tbody>
                {vendorOrders.orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order["DLR CODE"] || "N/A"}</td>
                    <td>{order["ZONE"] || "N/A"}</td>
                    <td>{order["BO DLR NO."] || "N/A"}</td>
                    <td>{order["Part no."] || "N/A"}</td>
                    <td>{order["Order no."] || "N/A"}</td>
                    <td>{order["PO"] || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p className="no-orders-text">No orders received yet.</p>
        )
      ) : (
        <p className="no-orders-text">No orders found for your vendor ID.</p>
      )}
    </div>
  );
};

export default VendorOrders;
