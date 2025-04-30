const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// Save report
router.post("/", async (req, res) => {
  try {
    const { vendor, reports, finalTotal,month } = req.body;

    if (!vendor || !reports || reports.length === 0) {
      return res.status(400).json({ message: "Vendor and reports are required" });
    }

    const newReport = new Report({ vendorId: vendor, reports, finalTotal,month });

    await newReport.save();
    res.status(201).json({ message: "Report saved successfully!" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch reports for a vendor
// Fetch all reports (No filtering by vendorId)
router.get("/getReportByVendor", async (req, res) => {  // ✅ This route should match /api/reports
  try {
    const { vendorId, month } = req.query; // Get vendorId and month from query params

    if (!vendorId || !month) {
      return res.status(400).json({ message: "Vendor ID and month are required." });
    }

    console.log(`🟢 Fetching reports for Vendor ID: ${vendorId}, Month: ${month}`);

    // Convert month number to match database field (assuming stored as timestamp/date)
    const startDate = new Date(new Date().getFullYear(), month - 1, 1); // First day of the month
    const endDate = new Date(new Date().getFullYear(), month, 0); // Last day of the month

    const reports = await Report.find({ 
      vendorId, 
      createdAt: { $gte: startDate, $lte: endDate } // Filter reports in the selected month
    });

    console.log("🟢 Reports found:", reports);
    res.json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
