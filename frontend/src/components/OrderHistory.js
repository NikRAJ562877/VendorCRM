import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [dealerName, setDealerName] = useState("");
  const [partNo, setPartNo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orderhistory");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = orders;

    if (dealerName) {
      filtered = filtered.filter(order =>
        order.dlrName.toLowerCase().includes(dealerName.toLowerCase())
      );
    }

    if (partNo) {
      filtered = filtered.filter(order =>
        order.partNo.toLowerCase().includes(partNo.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(order =>
        new Date(order.date).toISOString().split("T")[0] === selectedDate
      );
    }

    setFilteredOrders(filtered);
  }, [dealerName, partNo, selectedDate, orders]);

  if (loading) return <p>Loading order history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      {/* Filters */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by Dealer Name"
          value={dealerName}
          onChange={(e) => setDealerName(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="Search by Part No."
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
          className="filter-input"
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />

        <button onClick={() => { setDealerName(""); setPartNo(""); setSelectedDate(""); }} className="clear-filters">
          Clear Filters
        </button>
      </div>

      {/* Orders Table */}
      {/* Orders Table */}
<div className="table-wrapper">
  <table className="order-history-table">
    <thead>
      <tr>
        <th>Order No.</th>
        <th>Dealer Code</th>
        <th>Dealer Name</th>
        <th>Part No.</th>
        <th>Quantity</th>
        <th>PO</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <tr key={order._id}>
            <td>{order.orderNo}</td>
            <td>{order.dlrCode}</td>
            <td>{order.dlrName}</td>
            <td>{order.partNo}</td>
            <td>{order.qty}</td>
            <td>{order.po}</td>
            <td>{new Date(order.date).toLocaleDateString()}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7">No orders found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default OrderHistory;
