const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { vendorId, password } = req.body;
  console.log("Login attempt:", { vendorId, password });

  try {
    // Check if user is an admin
    let user = await Admin.findOne({ adminId: vendorId });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password mismatch for admin:", vendorId);
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      console.log("Login successful for admin:", vendorId);
      return res.json({ 
        message: 'Login successful', 
        user: { vendorId: user.adminId, role: 'admin' }
      });
    }

   // If no admin is found, try to find a vendor
user = await Vendor.findOne({ vendorId });

if (!user) {
  console.log("Vendor not found for vendorId:", vendorId);
  return res.status(404).json({ error: 'User not found' });
}

// Check password
if (password !== user.password) {
  console.log("Password mismatch for vendor:", vendorId);
  return res.status(400).json({ error: 'Invalid credentials' });
}

// ✅ Send name & email in response
console.log("Login successful for vendor:", vendorId);
return res.json({ 
  message: 'Login successful', 
  user: { 
    vendorId: user.vendorId, 
    name: user.name,       // ✅ Include name
    email: user.email,     // ✅ Include email
    role: 'vendor' 
  } 
});

  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
