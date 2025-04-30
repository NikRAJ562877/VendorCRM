const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  dlrCode: { type: String, alias: "DLRCODE" },
  dlrName: { type: String, alias: "DLRNAME" },
  partNo: { type: String, alias: "Part no." },
  qty: { type: String, alias: "Qty" },
  orderNo: { type: String, alias: "Order no." },
  po: { type: String, alias: "PO" },
  Location: { type: String, alias: "location" },
  Product: {type: String, alias: "product" },
  date: { type: Date, default: Date.now } // Add date field with default value
  
});

module.exports = mongoose.model("Order", OrderSchema);
