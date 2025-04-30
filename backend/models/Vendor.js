const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },   // ✅ Added Name Field
  email: { type: String, required: true, unique: true }, // ✅ Added Email Field
  password: { type: String, required: true },
  role: { type: String, default: 'vendor' } // defaults to vendor
});

module.exports = mongoose.model('Vendor', VendorSchema);
