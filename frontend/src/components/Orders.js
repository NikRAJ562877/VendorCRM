import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../css/Order.css";
import apiClient from "../api/auth"; // centralized API client

const Orders = () => {
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editableRows, setEditableRows] = useState({});
  const [setSelectedRows] = useState({});
  const [defaultDate, setDefaultDate] = useState("");

  const headers = [
    { key: "DLRCODE", label: "DLR CODE" },
    { key: "DLRNAME", label: "DLRNAME" },
    { key: "Part no.", label: "Part No." },
    { key: "Qty", label: "Qty" },
    { key: "Order no.", label: "Order No./New Order No." },
    { key: "PO", label: "PO" },
    { key: "Location", label: "Location" },
    { key: "Product", label: "Product" },
    { key: "date", label: "Date" },
  ];

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const extractedData = jsonData.map((row) => ({
        DLRCODE: row["DLRCODE"] || "",
        DLRNAME: row["DLRNAME"] || "",
        "Part no.": row["Part no."] || "",
        Qty: row["Qty"] || "",
        "Order no.": row["Order no."] || "",
        PO: row["PO"] || "",
        Location: row["Location"] || "",
        Product: row["Product"] || "",
        date: defaultDate || row["Date"] || "",
      }));

      setOrders(extractedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleEditRow = (index) => {
    setEditableRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleInputChange = (index, key, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][key] = value;
    setOrders(updatedOrders);
  };

  const deleteRow = (index) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const createNewRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      newRow[header.key] = header.key === "date" ? defaultDate || "" : "";
    });
    setOrders((prev) => [...prev, newRow]);
    setEditableRows((prev) => ({ ...prev, [orders.length]: true }));
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const sendToVendor = async () => {
    if (orders.length === 0) {
      alert("No orders to upload.");
      return;
    }

    const formattedOrders = orders.map((order) => ({
      dlrCode: order["DLRCODE"],
      dlrName: order["DLRNAME"],
      partNo: order["Part no."],
      qty: order["Qty"],
      orderNo: order["Order no."],
      po: order["PO"],
      location: order["Location"],
      product: order["Product"],
      date: order["date"] || new Date().toISOString().split("T")[0],
    }));

    try {
      const res = await apiClient({
        endpoint: "/order/upload",
        method: "POST",
        body: { orders: formattedOrders },
      });

      console.log("Response from API:", res);
      alert(`Successfully uploaded ${orders.length} orders to the backend.`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload orders. Please check the server logs and try again.");
    }
  };

  const filteredOrders = orders.filter((order) =>
    headers.some((header) =>
      order[header.key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="orders-container">
      <h2>Order Management</h2>

      <div className="top-controls">
        <label htmlFor="date">Select Date:</label>
        <input
          type="date"
          id="date"
          value={defaultDate}
          onChange={(e) => setDefaultDate(e.target.value)}
        />
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        <button onClick={createNewRow}>New Row</button>
        <button onClick={sendToVendor}>Send to Vendor</button>
      </div>

      {orders.length > 0 && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="table-container">
        {filteredOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header.key}>
                      {editableRows[index] ? (
                        <input
                          type={header.key === "date" ? "date" : "text"}
                          value={order[header.key]}
                          onChange={(e) =>
                            handleInputChange(index, header.key, e.target.value)
                          }
                        />
                      ) : (
                        order[header.key] || ""
                      )}
                    </td>
                  ))}
                  <td>
                    <button onClick={() => toggleEditRow(index)}>
                      {editableRows[index] ? "Save" : "Edit"}
                    </button>
                    <button onClick={() => deleteRow(index)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          orders.length > 0 && <p>No matching results found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
