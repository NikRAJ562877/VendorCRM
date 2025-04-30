const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

// Fetch all invoices (optional, for admin overview)
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// ✅ Fetch full invoice data for a specific vendor
router.get('/vendor-files/:vendorId', async (req, res)  => {
  const { vendorId } = req.params;
  console.log("Fetching invoices for vendorId:", vendorId);

  try {
    const invoices = await Invoice.find({ vendorId });
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this vendor.' });
    }
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vendor invoices' });
  }
});

module.exports = router;
