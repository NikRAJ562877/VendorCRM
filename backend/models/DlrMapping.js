const mongoose = require("mongoose");

const dlrMappingSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true }, // Vendor ID is unique
  dlrCodes: { type: [String], required: true } ,// Array of DLR codes,
  date: { type: String, default: "" },
});

module.exports = mongoose.model("DlrMapping", dlrMappingSchema);
