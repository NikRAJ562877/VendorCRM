import React, { useState } from "react";
import apiClient from "../api/auth"; // centralized API client
import "../css/ProductMasterScreen.css";

const ProductMaster = () => {
  const [category, setCategory] = useState("");
  const [partNo, setPartNo] = useState("");
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const categories = ["Ultra Premium PPF", "Ceramic Coating"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !partNo || !productName || !amount) {
      setMessage("All fields are required");
      return;
    }

    try {
      const response = await apiClient({
        endpoint: "/products/add-product",
        method: "POST",
        body: {
          category,
          partNo,
          productName,
          amount: Number(amount),
        },
      });

      setMessage(response.message || "Product saved successfully");
      setCategory("");
      setPartNo("");
      setProductName("");
      setAmount("");
    } catch (error) {
      setMessage(error.message || "Error saving product");
    }
  };

  return (
    <div className="product-master">
      <h2>Product Master</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Part No.:</label>
        <input
          type="text"
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
          required
        />

        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />

        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default ProductMaster;
