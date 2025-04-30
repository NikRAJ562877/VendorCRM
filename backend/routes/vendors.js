const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// POST /api/vendors
router.post('/', async (req, res) => {
  try {
    // ✅ Extract all required fields
    const { name, email, vendorId, password } = req.body;

    // ✅ Validate request body
    if (!name || !email || !vendorId || !password) {
      return res.status(400).json({ error: 'Please provide name, email, vendorId, and password' });
    }

    // ✅ Check if vendor already exists
    const existingVendor = await Vendor.findOne({ vendorId });
    if (existingVendor) {
      return res.status(400).json({ error: 'Vendor already exists' });
    }

    // ✅ Create and save new vendor
    const newVendor = new Vendor({ name, email, vendorId, password, role: 'vendor' });
    await newVendor.save();

    res.json({ message: 'Vendor created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
