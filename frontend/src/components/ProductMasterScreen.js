import React, { useState } from "react";
import apiClient from "../api/auth"; // centralized API client
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Typography, Box } from '@mui/material';

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
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 3, padding: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>
        Product Master
      </Typography>
      {message && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            required
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat, index) => (
              <MenuItem key={index} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Part No."
          variant="outlined"
          fullWidth
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <Button variant="contained" type="submit" fullWidth>
          Save Product
        </Button>
      </form>
    </Box>
  );
};

export default ProductMaster;
