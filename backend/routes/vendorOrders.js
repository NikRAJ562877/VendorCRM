const express = require('express');
const router = express.Router();
const VendorOrder = require('../models/VendorOrder');
const OrderSchema =require('../models/Order');
const DlrMapping = require('../models/DlrMapping');
// POST /api/vendorOrders/:vendorId/orders
// Send orders to a specific vendor
router.post('/:vendorId/orders', async (req, res) => {
  const { vendorId } = req.params;
  const ordersToSend = req.body; // Expecting an array of order objects

  if (!Array.isArray(ordersToSend) || ordersToSend.length === 0) {
    return res.status(400).json({ error: "Orders must be a non-empty array" });
  }

  try {
    // Check if an entry already exists for the vendor
    let vendorOrdersDoc = await OrderSchema.findOne({ vendorId });

    if (vendorOrdersDoc) {
      // Append new orders to the existing array
      vendorOrdersDoc.orders.push(...ordersToSend);
      await vendorOrdersDoc.save();
    } else {
      // Create a new entry for the vendor with these orders
      vendorOrdersDoc = new VendorOrder({ vendorId, orders: ordersToSend });
      await vendorOrdersDoc.save();
    }

    res.json({ message: "Orders sent successfully", vendorOrders: vendorOrdersDoc });

  } catch (err) {
    console.error("Error processing vendor orders:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/:vendorId/getOrderDtls', async (req, res) => { 
  try {
    const { vendorId } = req.params;
    console.log("Fetching orders for vendorId:", vendorId); // Debugging log
    const orders = await OrderSchema.find({ VendorsId: String(vendorId) });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this vendor." });
    }

    res.status(200).json({ orders }); // Wrap in an object
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/:vendorId", async (req, res) => {
  try {
      const { vendorId } = req.params;
      const { from_date, to_date } = req.query; // Get date range from frontend

      if (!from_date || !to_date) {
          return res.status(400).json({ message: "Please provide from_date and to_date" });
      }

      // 1. Find mapped DLR codes for this vendor
      const mapping = await DlrMapping.findOne({ vendorId });

      if (!mapping) {
          return res.status(404).json({ message: "No mapping found for this vendor" });
      }

      // 2. Fetch orders within the given date range and matching DLR codes
      const fetchedOrders  = await OrderSchema.find({
          dlrCode: { $in: mapping.dlrCodes }, // Match dlrCode
          date: { $gte: from_date, $lte: to_date } // Filter by date range
      });
      console.log("Fetched Orders:", fetchedOrders)
      res.json(fetchedOrders );
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
