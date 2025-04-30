const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const SendModel = require("../models/SendModel");

// ✅ Get dealer details & latest rejected report (if exists)
router.get("/dealer-details/:dlrCode", async (req, res) => {
  const { dlrCode } = req.params;
  try {
    const dealer = await Order.findOne({ dlrCode: new RegExp(`^${dlrCode}$`, "i") });
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found" });
    }

    const oldRejectedReport = await SendModel.findOne({
      dealerCode: new RegExp(`^${dlrCode}$`, "i"),
      status: "Rejected"
    }).sort({ createdAt: -1 });

    res.json({
      dlrName: dealer.dlrName,
      Location: dealer.Location,
      oldRejectedReport: oldRejectedReport
        ? {
            reportData: oldRejectedReport.reportData,
            rejectionReason: oldRejectedReport.rejectionReason
          }
        : null
    });
  } catch (err) {
    console.error("Error fetching dealer details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

 
// ✅ Submit report (new or resubmission)
router.post("/submit-report", async (req, res) => {
  const { company, dealerCode, dealerName, location, reportData, vendorId } = req.body;

  try {
    const existingPending = await SendModel.findOne({
      dealerCode: new RegExp(`^${dealerCode}$`, "i"),
      status: "Pending",
      vendorId
    });

    if (existingPending) {
      return res.status(400).json({ error: "A pending report already exists for this dealer." });
    }

    const newReport = new SendModel({
      company,
      dealerCode,
      dealerName,
      location,
      reportData,
      vendorId,
      status: "Pending",
      rejectionReason: null
    });

    const saved = await newReport.save();
    res.status(201).json({ message: "Report submitted", data: saved });
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).json({ error: "Failed to save report" });
  }
});


// ✅ Admin: Fetch all reports
router.get("/admin/reports", async (req, res) => {
  try {
    const reports = await SendModel.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    console.error("Failed to fetch reports:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin: Update report status (Accept or Reject)
router.patch("/report-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  try {
    const updated = await SendModel.findByIdAndUpdate(
      id,
      {
        status,
        rejectionReason: status === "Rejected" ? rejectionReason : null
      },
      { new: true }
    );
    res.json({ message: `Report ${status}`, data: updated });
  } catch (err) {
    console.error("Error updating report status:", err);
    res.status(500).json({ error: "Failed to update report status" });
  }
});

// ✅ Vendor: Fetch all submitted reports for a specific vendor
router.get("/vendor-reports", async (req, res) => {
  const { vendorId } = req.query;

  if (!vendorId) {
    return res.status(400).json({ error: "Missing vendorId in query." });
  }

  try {
    const reports = await SendModel.find({ vendorId })
      .select("dealerCode dealerName company location reportData status rejectionReason createdAt")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching vendor reports:", err);
    res.status(500).json({ message: "Failed to fetch vendor reports" });
  }
});


module.exports = router;
