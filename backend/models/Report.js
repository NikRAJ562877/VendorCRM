const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  reports: [
    {
      category: String,
      partNo: String,
      productName: String,
      amount: Number,
      qty: Number,
      total: Number,
      
    },
  ],
  finalTotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  month: { type: Number, required: true, min: 1, max: 12 },
});

module.exports = mongoose.model("Report", ReportSchema);
