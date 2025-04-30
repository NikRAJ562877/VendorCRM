const express = require('express');
const multer = require('multer');
const path = require('path');
const Invoice = require('../models/Invoice');
const router = express.Router();

// Configure file storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

 
// Upload Invoice
router.post('/upload', upload.any(), async (req, res) => {
  try {
    console.log('📥 Received Upload Request');
    console.log('📝 Received Files:', req.files);
    console.log('📦 Received Body:', req.body);

    if (!req.body.invoices) {
      return res.status(400).json({ error: 'Invoice data is missing' });
    }

    // ✅ Parse invoice data
    const invoicesData = JSON.parse(req.body.invoices);
    console.log('✅ Parsed Invoices:', invoicesData);

    // ✅ Map files to correct invoices based on index
    const invoices = invoicesData.map((inv, index) => {
      // Extract all files associated with this invoice index
      const invoiceFiles = req.files.filter((file) => file.fieldname === `files-${index}`);

      return {
        invoiceNo: inv.invoiceNo,
        date: inv.date,
        month: inv.month,
        amount: inv.amount,
        vendorId: inv.vendorId || 'Unknown',
        fileName: invoiceFiles.map((file) => file.filename), // ✅ Store multiple filenames as an array
      };
    });

    console.log('📄 Final Invoices for MongoDB:', invoices);

    // ✅ Save invoices to MongoDB
    await Invoice.insertMany(invoices);
    res.status(200).json({ message: 'Invoices uploaded successfully' });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Failed to upload invoices', details: error.message });
  }
});



// ✅ Serve static files from the "uploads" folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Fetch Invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

module.exports = router;
