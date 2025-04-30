const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  partNo: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true }, // Ensure amount is a Number
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
