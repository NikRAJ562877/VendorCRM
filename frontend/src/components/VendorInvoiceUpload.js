import React, { useState } from "react";
import apiClient from "../api/auth"; // Importing apiClient
import "../css/VendorInvoiceUpload.css";

const VendorInvoiceUpload = () => {
  const [invoices, setInvoices] = useState([]);

  // ✅ Fetch vendorId from sessionStorage
  const vendorId = JSON.parse(sessionStorage.getItem("user"))?.vendorId || null;

  const addInvoice = () => {
    setInvoices([...invoices, { invoiceNo: "", date: "", month: "", amount: "", file: null }]);
  };

  const deleteInvoice = (index) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
  };

  const handleChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedInvoices = [...invoices];
  
    if (name === "file") {
      updatedInvoices[index][name] = files ? Array.from(files) : [];
    } else {
      updatedInvoices[index][name] = value;
    }
  
    setInvoices(updatedInvoices);
  };
  

  // ✅ Calculate Total Amount Dynamically
  const totalAmount = invoices.reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);

  const handleSubmit = async () => {
    if (!vendorId) {
      alert("Vendor ID is missing. Please log in again.");
      return;
    }
  
    const formData = new FormData();
  
    // ✅ Attach invoice data
    const invoiceData = invoices.map(({ file, ...invoice }) => ({
      ...invoice,
      vendorId,
    }));
    formData.append("invoices", JSON.stringify(invoiceData));
  
    // ✅ Attach files with indexed keys
    invoices.forEach((invoice, index) => {
      if (invoice.file) {
        invoice.file.forEach((file) => {
          formData.append(`files-${index}`, file); // ✅ Send indexed file field names
          console.log(`📤 Appending File:`, file.name, `as files-${index}`);
        });
      }
    });
  
    console.log("📦 FormData Content:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      // Use apiClient for making the POST request
      const response = await apiClient({
        endpoint: "/vendor-invoices/upload",
        method: "POST",
        body: formData,
        token: sessionStorage.getItem("authToken"), // Assuming token is stored in sessionStorage
      });
  
      alert("Invoices uploaded successfully");
      console.log("✅ Response Data:", response.data);
      setInvoices([]); // Clear form on success
    } catch (error) {
      console.error("❌ Upload failed:", error.response?.data || error.message);
      alert(`Failed to upload invoices: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="vendor-invoice-container">
      <h2>Upload Invoices</h2>
      {invoices.map((invoice, index) => (
        <div key={index} className="vendor-invoice-box">
          <input type="text" name="invoiceNo" placeholder="Invoice No." value={invoice.invoiceNo} onChange={(e) => handleChange(index, e)} />
          <input type="date" name="date" value={invoice.date} onChange={(e) => handleChange(index, e)} />
          <input type="month" name="month" value={invoice.month} onChange={(e) => handleChange(index, e)} />
          <input type="number" name="amount" placeholder="Amount" value={invoice.amount} onChange={(e) => handleChange(index, e)} />
          <input type="file" name="file" multiple onChange={(e) => handleChange(index, e)} />
          <button className="delete-btn" onClick={() => deleteInvoice(index)}>❌ Delete</button>
        </div>
      ))}

      {/* ✅ Show Total Amount */}
      <div className="vendor-invoice-total">
        <strong>Total Amount: </strong> {totalAmount.toLocaleString()}  
      </div>

      <div className="vendor-invoice-buttons">
        <button className="vendor-invoice-add-btn" onClick={addInvoice}>➕ Add Invoice</button>
        <button className="vendor-invoice-submit-btn" onClick={handleSubmit}>📤 Submit Invoices</button>
      </div>
    </div>
  );
};

export default VendorInvoiceUpload;
