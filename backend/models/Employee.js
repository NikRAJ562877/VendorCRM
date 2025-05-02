const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  EmployeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },   // ✅ Added Name Field
  email: { type: String, required: true, unique: true }, // ✅ Added Email Field
  password: { type: String, required: true },
  role: { type: String, default: 'Employee' } // defaults to vendor
});

module.exports = mongoose.model('Employee', EmployeeSchema);
