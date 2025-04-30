  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const xlsx = require('xlsx');
  const Order = require('../models/Order');
  const DlrMapping =require('../models/DlrMapping')
  // Configure multer for in-memory storage
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  // POST /api/orders/upload - Extract and save Excel data
  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const { orders } = req.body;
      if (!orders || orders.length === 0) {
        return res.status(400).json({ error: "No orders provided" });
      }

      console.log("Received Orders:", orders);

      // Transform data to match DB schema (if necessary)
      const formattedOrders = orders.map((row) => ({
        dlrCode: row.dlrCode || "",
        dlrName: row.dlrName || "",
        partNo: row.partNo || "",
        Qty: row.qty || "",
        orderNo: row.orderNo || "",
        po: row.po || "",
        location: row.location || "",
        product: row.product || "",
        date: row.date ? new Date(row.date) : new Date(), // If your payload calls it "VendorsId"
      }));

      // Insert into DB
      const insertedOrders = await Order.insertMany(formattedOrders);

      res.json({ message: "Orders successfully saved to the database!", data: insertedOrders });
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  

  // GET /api/orders - Retrieve all orders
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/orders - Create a new order
  router.post('/', async (req, res) => {
    try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.json(savedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/orders/:id - Update an order
  router.put('/:id', async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/orders/:id - Delete an order
  router.delete('/:id', async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ message: 'Order deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  //router vendorID
 
  module.exports = router;
