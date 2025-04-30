const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// Route to fetch report history
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    console.error("Error fetching report history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
