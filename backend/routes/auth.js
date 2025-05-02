const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const Employee = require('../models/Employee');
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

    if (user) {
      // Vendor credentials check
      if (password !== user.password) {
        console.log("Password mismatch for vendor:", vendorId);
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      console.log("Login successful for vendor:", vendorId);
      return res.json({
        message: 'Login successful',
        user: {
          vendorId: user.vendorId,
          name: user.name,
          email: user.email,
          role: 'vendor',
        }
      });
    }

    // If no admin or vendor, check if user is an employee
    user = await Employee.findOne({ EmployeeId: vendorId });

    if (!user) {
      console.log("Employee not found for EmployeeId:", vendorId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Check password for employee
    if (password !== user.password) {
      console.log("Password mismatch for employee:", vendorId);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("Login successful for employee:", vendorId);
    return res.json({
      message: 'Login successful',
      user: {
        vendorId: user.EmployeeId,
        name: user.name,
        email: user.email,
        role: 'employee',
      }
    });

  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
