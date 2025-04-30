const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// POST /api/admins
router.post('/', async (req, res) => {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ error: 'Please provide adminId and password' });
    }
    const existingAdmin = await Admin.findOne({ adminId });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({ adminId, password: hashedPassword });
    await newAdmin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
