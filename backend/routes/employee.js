const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); 

// POST /api/vendors/employee → For Employee Creation
router.post('/', async (req, res) => {
    try {
      const { name, email, EmployeeId, password } = req.body;
  
      if (!name || !email || !EmployeeId || !password) {
        return res.status(400).json({ error: 'Please provide name, email, Employee ID, and password' });
      }
  
      const existingEmployee = await Employee.findOne({ EmployeeId });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Employee already exists' });
      }
  
      const newEmployee = new Employee({ name, email, EmployeeId, password, role: 'Employee' });
      await newEmployee.save();
  
      res.json({ message: 'Employee created successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;