const mongoose = require('mongoose');

const VendorOrderSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  orders: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorOrder', VendorOrderSchema);
