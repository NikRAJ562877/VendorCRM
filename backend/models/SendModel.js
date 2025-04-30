const mongoose = require("mongoose");

const SendSchema = new mongoose.Schema(
  {
    company: String,
    dealerCode: String,
    dealerName: String,
    location: String,
    reportData: Object,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending"
    },
    rejectionReason: {
      type: String,
      default: null
    },
    vendorId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("SendModel", SendSchema);
