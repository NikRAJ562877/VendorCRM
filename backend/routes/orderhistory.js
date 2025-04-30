const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Import the Order model

// ✅ Fetch order history
 router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
